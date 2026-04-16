import { TryCatch } from "../middleware/error.js";
import { Order } from "../models/order.js";
import { stripe } from "../server.js";
import ErrorHandler from "../utils/utility-class.js";
import crypto from "crypto";
import Razorpay from "razorpay";
import { invalidateCache } from "../utils/features.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.js";
import { adminOrderEmailTemplate } from "../templates/orderEmailTemplate.js";
import { generateInvoiceBuffer } from "../utils/generateInvoiceBuffer.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export const stripeWebhook = TryCatch(async (req, res, next) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    return next(new ErrorHandler("No signature found", 400));
  }

  let event;

  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Stripe webhook verification failed:", err.message);
    return next(new ErrorHandler(`Webhook Error: ${err.message}`, 400));
  }


  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as any;

    
      const order = await Order.findOne({
        "paymentInfo.paymentId": paymentIntent.id
      });

      if (order) {
     
        order.paymentInfo = order.paymentInfo || {
          gateway: "Stripe",
          paymentId: paymentIntent.id,
          gatewayOrderId: paymentIntent.id,
        };
        order.paymentInfo.signature = paymentIntent.latest_charge || "";
        order.paymentStatus = "paid";

        await order.save();

       
        try {
          const userData = await User.findById(order.user);
          if (userData?.email) {
            const invoiceBuffer = await generateInvoiceBuffer(order);
            await sendEmail({
              to: userData.email,
              subject: "Payment Confirmed - Barwa",
              html: `<h2>Payment Confirmed!</h2><p>Your payment for order #${order._id} has been successfully processed.</p>`,
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
              subject: `Payment Received - ₹${order.total}`,
              html: adminOrderEmailTemplate(order, userData),
            });
          }
        } catch (err) {
          console.error("Email failed:", err);
        }

        invalidateCache({
          order: true,
          admin: true,
          _id: String(order.user),
          orderId: String(order._id),
        });
      }
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object as any;
      const failedOrder = await Order.findOne({
        "paymentInfo.paymentId": failedIntent.id
      });

      if (failedOrder) {
        failedOrder.paymentStatus = "failed";
        failedOrder.status = "Cancelled";
        await failedOrder.save();

        // Restore stock
        for (const item of failedOrder.orderItems) {
          const product = await import("../models/product.js").then(m => m.Product);
          const prod = await product.findById(item.productId);
          if (prod) {
            prod.stock += item.quantity;
            await prod.save();
          }
        }

        invalidateCache({
          product: true,
          order: true,
          admin: true,
          _id: String(failedOrder.user),
          productId: failedOrder.orderItems.map((i) => String(i.productId)),
        });
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});


export const razorpayWebhook = TryCatch(async (req, res, next) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  const signature = req.headers["x-razorpay-signature"] as string;

  if (digest !== signature) {
    return next(new ErrorHandler("Invalid webhook signature", 400));
  }

  const event = req.body;

  switch (event.event) {
    case "payment.captured":
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.orderId;


      const order = await Order.findOne({
        $or: [
          { "paymentInfo.paymentId": payment.id },
          { _id: orderId }
        ]
      });

      if (order) {
        order.paymentInfo = order.paymentInfo || {
          gateway: "Razorpay",
          paymentId: payment.id,
          gatewayOrderId: payment.order_id,
        };
        order.paymentInfo.signature = payment.signature || "";
        order.paymentStatus = "paid";

        await order.save();

   
        try {
          const userData = await User.findById(order.user);
          if (userData?.email) {
            const invoiceBuffer = await generateInvoiceBuffer(order);
            await sendEmail({
              to: userData.email,
              subject: "Payment Confirmed - Barwa",
              html: `<h2>Payment Confirmed!</h2><p>Your Razorpay payment for order #${order._id} has been successfully processed.</p>`,
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
              subject: `Payment Received - ₹${order.total}`,
              html: adminOrderEmailTemplate(order, userData),
            });
          }
        } catch (err) {
          console.error("Email failed:", err);
        }

        invalidateCache({
          order: true,
          admin: true,
          _id: String(order.user),
          orderId: String(order._id),
        });
      }
      break;

    case "payment.failed":
      const failedPayment = event.payload.payment.entity;
      const failedOrderId = failedPayment.notes?.orderId;

      const failedOrder = await Order.findOne({
        $or: [
          { "paymentInfo.paymentId": failedPayment.id },
          { _id: failedOrderId }
        ]
      });

      if (failedOrder) {
        failedOrder.paymentStatus = "failed";
        failedOrder.status = "Cancelled";
        await failedOrder.save();

        // Restore stock
        for (const item of failedOrder.orderItems) {
          const productModule = await import("../models/product.js");
          const prod = await productModule.Product.findById(item.productId);
          if (prod) {
            prod.stock += item.quantity;
            await prod.save();
          }
        }

        invalidateCache({
          product: true,
          order: true,
          admin: true,
          _id: String(failedOrder.user),
          productId: failedOrder.orderItems.map((i) => String(i.productId)),
        });
      }
      break;

    default:
      console.log(`Unhandled Razorpay event type: ${event.event}`);
  }

  res.json({ received: true });
});