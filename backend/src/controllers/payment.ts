import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import { stripe } from "../server.js";
import ErrorHandler from "../utils/utility-class.js";
import Razorpay from "razorpay";
import crypto from "crypto";

import { calculateOrderPricing } from "../utils/pricing.js";
import { OrderItemType } from "../types/types.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { orderItems, couponCode } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return next(new ErrorHandler("Please provide order items", 400));
  }

  const pricing = await calculateOrderPricing(
    orderItems as OrderItemType[],
    couponCode
  );

  if (pricing.total <= 0) {
    return next(new ErrorHandler("Order total must be greater than 0", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: pricing.total * 100, // paise
    currency: "inr",
    automatic_payment_methods: { enabled: true },
  });

  return res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  
    total: pricing.total,
  });
});


export const createRazorpayOrder = TryCatch(async (req, res, next) => {
  const { orderItems, couponCode } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return next(new ErrorHandler("Please provide order items", 400));
  }

  const pricing = await calculateOrderPricing(
    orderItems as OrderItemType[],
    couponCode
  );

  if (pricing.total <= 0) {
    return next(new ErrorHandler("Order total must be greater than 0", 400));
  }

  const order = await razorpay.orders.create({
    amount: pricing.total * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return res.status(201).json({
    success: true,
    order,
    total: pricing.total,
  });
});

export const verifyRazorpayPayment = TryCatch(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorHandler("Missing payment verification parameters.", 400));
  }

  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string"
  ) {
    return next(new ErrorHandler("Invalid payment verification parameter types", 400));
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.status(200).json({ success: true, message: "Payment Verified Successfully" });
  } else {
    return next(new ErrorHandler("Payment Verification Failed", 400));
  }
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount, type, productId } = req.body || {};

  if (!coupon || amount === undefined)
    return next(new ErrorHandler("Please enter Both Amount and Coupon", 400));

  const upperCaseCoupon = coupon.toUpperCase();

  await Coupon.create({
    coupon: upperCaseCoupon,
    amount,
    type: type || "flat",
    productId: productId || null,
  });

  return res.status(200).json({
    success: true,
    message: `Coupon ${upperCaseCoupon} Created Successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const upperCaseCoupon = String(coupon).toUpperCase();

  const discountData = await Coupon.findOne({ coupon: upperCaseCoupon });
  if (!discountData) return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({ success: true, coupon: discountData });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return res.status(200).json({ success: true, coupons });
});

export const getCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));
  return res.status(200).json({ success: true, coupon });
});

export const updateCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { coupon, amount } = req.body;

  const couponData = await Coupon.findById(id);
  if (!couponData) return next(new ErrorHandler("Invalid Coupon ID", 400));

  if (coupon) couponData.coupon = coupon.toUpperCase();
  if (amount) couponData.amount = amount;

  await couponData.save();

  return res.status(200).json({
    success: true,
    message: `Coupon ${couponData.coupon} Updated Successfully`,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.coupon} Deleted Successfully`,
  });
});