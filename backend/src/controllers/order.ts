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
import { adminCancelEmailTemplate, adminOrderEmailTemplate, customerCancelEmailTemplate, orderEmailTemplate } from "./../templates/orderEmailTemplate.js";
import { generateInvoiceBuffer } from "../utils/generateInvoiceBuffer.js";
import { delhiveryAPI } from "../utils/delhivery.js";

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
    const { shippingInfo, orderItems, paymentMethod } = req.body;

    const user = req.user!._id;

    if (!shippingInfo || !orderItems || orderItems.length === 0) {
      return next(new ErrorHandler("Invalid order data", 400));
    }

    
    const session = await Product.startSession();
    session.startTransaction();

    try {
     
      let subtotal = 0;

      for (const item of orderItems) {
        const product = await Product.findById(item.productId).session(session);

        if (!product) {
          throw new ErrorHandler("Product not found", 404);
        }

        const price = product.salePrice || product.price;

        if (product.stock < item.quantity) {
          throw new ErrorHandler(`${product.name} out of stock`, 400);
        }

        subtotal += price * item.quantity;
      }

      const tax = Math.round(subtotal * 0.18);
      const shippingCharges = subtotal > 1000 ? 0 : 50;
      const discount = 0; // apply coupon logic later
      const total = subtotal + tax + shippingCharges - discount;

    
      const [order] = await Order.create(
        [
          {
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
            paymentMethod: paymentMethod || "COD",
            paymentStatus: "pending", 
            status: "Processing",
          },
        ],
        { session }
      );

     
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity },
          },
          { $inc: { stock: -item.quantity } },
          { session }
        );

        if (!updated) {
          throw new ErrorHandler("Stock update failed", 400);
        }
      }

     
      await session.commitTransaction();
      session.endSession();

      
      invalidateCache({
        product: true,
        order: true,
        admin: true,
        _id: user,
        productId: order.orderItems.map((i) => String(i.productId)),
      });

      
      try {
        const userData = await User.findById(user);

        const invoiceBuffer = await generateInvoiceBuffer(order);

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

        if (process.env.ADMIN_EMAIL) {
          await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `New Order - ₹${order.total}`,
            html: adminOrderEmailTemplate(order, userData),
          });
        }
      } catch (err) {
        console.error("Email failed:", err);
      }

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        orderId: order._id,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(error);
    }
  }
);

export const cancelOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) return next(new ErrorHandler("Order not found", 404));
 
  const orderUserId = typeof order.user === "object" ? (order.user as any)._id.toString() : order.user.toString();

  if (orderUserId !== req.user!._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  if (order.status !== "Processing") {
    return next(
      new ErrorHandler("Only Processing orders can be cancelled", 400),
    );
  }


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

 
try {
    const userEmail = (order.user as any).email;
    const userName = (order.user as any).name;

    if (userEmail) {
    
      await sendEmail({
        to: userEmail,
        subject: "Order Cancelled - Barwa",
        html: customerCancelEmailTemplate(order, userName),
      });

  
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL as string,
          subject: `Cancelled ⚠️ Order #${String(order._id).slice(-8).toUpperCase()}`,
          html: adminCancelEmailTemplate(order, userName, userEmail),
        });
      }
    }
  } catch (error) {
    console.error("Failed to send cancellation emails:", error);
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

  
  const requestingUser = req.user!;
  const orderUserId = typeof order.user === "object" ? (order.user as any)._id.toString() : order.user.toString();
  
  if (
    orderUserId !== requestingUser._id.toString() &&
    requestingUser.role !== "admin"
  ) {
    return next(new ErrorHandler("Unauthorized", 403));
  }

  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`,
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  
  doc.fontSize(28).font("Helvetica-Bold").fillColor("#111111").text("BARWA", 50, 50);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#6b7280")
    .text("Next-Gen Electronics", 50, 82);

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text("INVOICE", 400, 50, { align: "right" });

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#4b5563")
    .text(`Invoice #: ${String(order._id).slice(-8).toUpperCase()}`, 400, 80, { align: "right" })
    .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 400, 95, { align: "right" })
    .text(`Status: ${order.status}`, 400, 110, { align: "right" });

  doc.moveDown(3);

 
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#e5e7eb").stroke();
  doc.moveDown(1);

 
  const customerName = typeof order.user === "object" ? (order.user as any).name : "Customer";
  
  doc.fontSize(12).font("Helvetica-Bold").fillColor("#111827").text("Billed & Shipped To:", 50, doc.y);
  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#4b5563")
    .text(order.shippingInfo?.fullName || customerName)
    .text(order.shippingInfo?.address ?? "")
    .text(`${order.shippingInfo?.city ?? ""}, ${order.shippingInfo?.state ?? ""}`)
    .text(`${order.shippingInfo?.country ?? ""} — ${order.shippingInfo?.pinCode ?? ""}`);


  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .fillColor("#111827")
    .text("Payment Method: ", 400, doc.y - 45) 
    .font("Helvetica")
    .fillColor("#4b5563")
    .text(order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online", 400, doc.y + 2);

  doc.moveDown(3);

  
  const tableTop = doc.y;
  
  doc.rect(50, tableTop, 495, 25).fill("#f3f4f6");
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(10);
  
  doc.text("ITEM", 60, tableTop + 8, { width: 230 });
  doc.text("QTY", 300, tableTop + 8, { width: 50, align: "center" });
  doc.text("PRICE", 370, tableTop + 8, { width: 70, align: "right" });
  doc.text("TOTAL", 460, tableTop + 8, { width: 75, align: "right" });

  doc.moveDown(1.5);

 
  let yPosition = doc.y;
  doc.font("Helvetica").fontSize(10).fillColor("#4b5563");

  for (const item of order.orderItems) {
    doc.text(item.name, 60, yPosition, { width: 230 });
    doc.text(String(item.quantity), 300, yPosition, { width: 50, align: "center" });
    doc.text(`Rs. ${item.price.toLocaleString("en-IN")}`, 370, yPosition, { width: 70, align: "right" });
    doc.text(`Rs. ${(item.price * item.quantity).toLocaleString("en-IN")}`, 460, yPosition, { width: 75, align: "right" });
    
    yPosition += 25; 
    doc.moveTo(50, yPosition - 10).lineTo(545, yPosition - 10).strokeColor("#f3f4f6").stroke();
  }

  doc.y = yPosition + 10;


  const summaryLeft = 360;
  const summaryRight = 545;

  const summaryRow = (label: string, value: string, isBold = false) => {
    const y = doc.y;
    doc
      .font(isBold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(10)
      .fillColor(isBold ? "#111827" : "#4b5563")
      .text(label, summaryLeft, y, { width: 100 })
      .text(value, 460, y, { width: summaryRight - 460, align: "right" });
    doc.moveDown(0.6);
  };

  summaryRow("Subtotal:", `Rs. ${order.subtotal.toLocaleString("en-IN")}`);
  summaryRow("Tax (GST):", `Rs. ${Math.round(order.tax).toLocaleString("en-IN")}`);
  summaryRow("Shipping:", order.shippingCharges === 0 ? "FREE" : `Rs. ${order.shippingCharges.toLocaleString("en-IN")}`);
  
  if (order.discount > 0) {
    summaryRow("Discount:", `- Rs. ${order.discount.toLocaleString("en-IN")}`);
  }

  doc.moveDown(0.5);
  doc.moveTo(360, doc.y).lineTo(545, doc.y).strokeColor("#111827").stroke();
  doc.moveDown(0.5);

 
  doc.fontSize(14);
  summaryRow("Total:", `Rs. ${order.total.toLocaleString("en-IN")}`, true);

  
  doc.moveDown(4);
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#9ca3af")
    .text("Thank you for shopping with Barwa!", { align: "center" })
    .text("For support, email us at: support@barwa.com", { align: "center" });

  doc.end();
});
