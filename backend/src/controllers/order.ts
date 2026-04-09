import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache } from "../server.js";
import PDFDocument from "pdfkit";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.js";
import { orderEmailTemplate } from "./../templates/orderEmailTemplate.js";
import { generateInvoiceBuffer } from "../utils/generateInvoiceBuffer.js";

export const myOrders = TryCatch(async (req, res, next) => {
  const user = req.user!._id;
  const key = `my-orders-${user}`;
  let orders;

  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find({ user });
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({ success: true, orders });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;
  let orders;

  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find().populate("user", "name");
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({ success: true, orders });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;
  let order;

  if (nodeCache.has(key)) order = JSON.parse(nodeCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order not found", 404));
    nodeCache.set(key, JSON.stringify(order));
  }

  // FIX #2: ownership check — user can only see their own orders
  const requestingUser = req.user!;
  const orderUserId =
    typeof order.user === "object"
      ? order.user._id.toString()
      : order.user.toString();

  if (
    orderUserId !== requestingUser._id.toString() &&
    requestingUser.role !== "admin"
  ) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  return res.status(200).json({ success: true, order });
});

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    const user = req.user!._id;

    const userData = await User.findById(user);

    if (!shippingInfo || !orderItems || !subtotal || !tax || !total)
      return next(new ErrorHandler("Please enter all fields", 400));

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    await reduceStock(orderItems);

    invalidateCache({
      product: true,
      order: true,
      admin: true,
      _id: user,
      productId: order.orderItems.map((i) => String(i.productId)),
    });

    try {
      const invoiceBuffer = await generateInvoiceBuffer(order);

      // Email to customer
      if (userData?.email) {
        await sendEmail({
          to: userData.email,
          subject: "Order Confirmation - Barwa",
          html: orderEmailTemplate(order, userData.email),
          attachments: [
            {
              filename: `invoice-${order._id}.pdf`,
              content: invoiceBuffer,
            },
          ],
        });
      }

      await sendEmail({
        to: process.env.ADMIN_EMAIL as string,
        subject: "New Order Received",
        html: `
      <h2>New Order Received</h2>
      <p>Order ID: ${order._id}</p>
      <p>Total: ₹${order.total}</p>
      <p>Customer: ${userData?.email}</p>
    `,
        attachments: [
          {
            filename: `invoice-${order._id}.pdf`,
            content: invoiceBuffer,
          },
        ],
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  },
);

export const cancelOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  
  // We populate the user so we can get their email address for the notification!
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) return next(new ErrorHandler("Order not found", 404));

  // Handle TS typing for populated user field
  const orderUserId = typeof order.user === "object" ? (order.user as any)._id.toString() : order.user.toString();

  // Only the owner can cancel their order
  if (orderUserId !== req.user!._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  if (order.status !== "Processing") {
    return next(
      new ErrorHandler("Only Processing orders can be cancelled", 400),
    );
  }

  // Restock each item
  for (const item of order.orderItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = "Cancelled";
  await order.save();

  invalidateCache({
    product: true,
    order: true,
    admin: true,
    _id: String(orderUserId), 
    orderId: String(order._id),
  });

  // ✅ SEND CANCELLATION EMAIL
  try {
    const userEmail = (order.user as any).email;
    const userName = (order.user as any).name;

    if (userEmail) {
      await sendEmail({
        to: userEmail,
        subject: "Order Cancelled - Barwa",
        html: `
          <h2>Order Cancelled</h2>
          <p>Hi ${userName},</p>
          <p>Your order <strong>#${order._id}</strong> has been successfully cancelled.</p>
          <p>Any applied charges will be refunded to your original payment method within 3-5 business days.</p>
          <p>We hope to see you shopping with us again soon!</p>
        `,
      });
    }
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }

  return res.status(200).json({
    success: true,
    message: "Order cancelled and stock restored",
  });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  // Populate user to grab their email address
  const order = await Order.findById(id).populate("user", "name email");
  if (!order) return next(new ErrorHandler("Order not found", 404));

  if (order.status === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      return next(new ErrorHandler("Cannot process this order status", 400));
  }

  await order.save();

  const orderUserId = typeof order.user === "object" ? (order.user as any)._id.toString() : order.user.toString();

  invalidateCache({
    order: true,
    admin: true,
    _id: String(orderUserId), 
    orderId: String(order._id),
  });

  // ✅ SEND PROCESSING EMAIL (Shipped or Delivered)
  try {
    const userEmail = (order.user as any).email;
    const userName = (order.user as any).name;

    if (userEmail) {
      let subject = "";
      let html = "";

      if (order.status === "Shipped") {
        subject = "Your Barwa Order has been Shipped! 🚚";
        html = `
          <h2>Great news, ${userName}!</h2>
          <p>Your order <strong>#${order._id}</strong> has been packed and handed over to our delivery partners.</p>
          <p>It is currently on its way to your shipping address.</p>
        `;
      } else if (order.status === "Delivered") {
        subject = "Your Barwa Order has been Delivered! 🎉";
        html = `
          <h2>Order Delivered!</h2>
          <p>Hi ${userName},</p>
          <p>Your order <strong>#${order._id}</strong> has been marked as delivered.</p>
          <p>We hope you love your new purchase! If you have any issues, please reply to this email.</p>
        `;
      }

      await sendEmail({ to: userEmail, subject, html });
    }
  } catch (error) {
    console.error("Failed to send processing email:", error);
  }

  return res.status(200).json({
    success: true,
    message: "Order status updated successfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order not found", 404));

  await order.deleteOne();

  invalidateCache({
    order: true,
    admin: true,
    _id: String(order.user), // ✅ FIX: Cast ObjectId to String
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});


export const generateInvoice = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) return next(new ErrorHandler("Order not found", 404));

  // Ownership check
  const requestingUser = req.user!;
  if (
    order.user.toString() !== requestingUser._id.toString() &&
    requestingUser.role !== "admin"
  ) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`,
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // ── Header ──
  doc.fontSize(24).font("Helvetica-Bold").text("MyShop", { align: "left" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#9ca3af")
    .text("Mobile Phone Accessories", { align: "left" });

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#000")
    .text("INVOICE", { align: "right" });

  doc.moveDown();

  // ── Order Meta ──
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#374151")
    .text(`Invoice #: ${String(order._id).slice(-8).toUpperCase()}`)
    .text(`Date: ${new Date().toLocaleDateString("en-IN")}`)
    .text(`Status: ${order.status}`);

  doc.moveDown();

  // ── Divider ──
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();

  doc.moveDown(0.5);

  // ── Shipping Info ──
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#111827").text("Bill To:");

  doc
    .fontSize(14)
    .text("Shipping Address", { underline: true })
    .fontSize(12)
    .text(order.shippingInfo?.address ?? "")
    .text(
      `${order.shippingInfo?.city ?? ""}, ${order.shippingInfo?.state ?? ""}`,
    )
    .text(
      `${order.shippingInfo?.country ?? ""} — ${order.shippingInfo?.pinCode ?? ""}`,
    )
    .moveDown();

  doc.moveDown();

  // ── Items Table Header ──
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();

  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").fontSize(10).fillColor("#6b7280");
  doc.text("ITEM", 50, doc.y, { width: 250 });
  doc.text("QTY", 300, doc.y - doc.currentLineHeight(), { width: 80 });
  doc.text("PRICE", 380, doc.y - doc.currentLineHeight(), { width: 80 });
  doc.text("TOTAL", 460, doc.y - doc.currentLineHeight(), {
    width: 80,
    align: "right",
  });

  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();
  doc.moveDown(0.5);

  // ── Items ──
  doc.font("Helvetica").fontSize(10).fillColor("#111827");

  for (const item of order.orderItems) {
    const y = doc.y;
    doc.text(item.name, 50, y, { width: 250 });
    doc.text(String(item.quantity), 300, y, { width: 80 });
    doc.text(`Rs.${item.price.toLocaleString("en-IN")}`, 380, y, { width: 80 });
    doc.text(
      `Rs.${(item.price * item.quantity).toLocaleString("en-IN")}`,
      460,
      y,
      { width: 80, align: "right" },
    );
    doc.moveDown();
  }

  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();
  doc.moveDown(0.5);

  // ── Summary ──
  const summaryLeft = 380;
  const summaryRight = 545;

  const summaryRow = (label: string, value: string, bold = false) => {
    const y = doc.y;
    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(10)
      .fillColor(bold ? "#111827" : "#374151")
      .text(label, summaryLeft, y, { width: 80 })
      .text(value, 460, y, { width: summaryRight - 460, align: "right" });
    doc.moveDown(0.4);
  };

  summaryRow("Subtotal", `Rs.${order.subtotal.toLocaleString("en-IN")}`);
  summaryRow(
    "Tax (GST)",
    `Rs.${Math.round(order.tax).toLocaleString("en-IN")}`,
  );
  summaryRow(
    "Shipping",
    order.shippingCharges === 0
      ? "FREE"
      : `Rs.${order.shippingCharges.toLocaleString("en-IN")}`,
  );
  if (order.discount > 0) {
    summaryRow("Discount", `- Rs.${order.discount.toLocaleString("en-IN")}`);
  }

  doc.moveDown(0.5);
  doc.moveTo(380, doc.y).lineTo(545, doc.y).strokeColor("#111827").stroke();
  doc.moveDown(0.5);

  summaryRow("Total Paid", `Rs.${order.total.toLocaleString("en-IN")}`, true);

  // ── Footer ──
  doc.moveDown(2);
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#9ca3af")
    .text("Thank you for shopping with MyShop!", { align: "center" })
    .text("For queries: support@myshop.com", { align: "center" });

  doc.end();
});
