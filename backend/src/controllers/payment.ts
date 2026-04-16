import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import { stripe } from "../server.js";
import ErrorHandler from "../utils/utility-class.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter Amount", 400));

  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  return res.status(201).json({
    success: true,
    order, 
   });
});


export const verifyRazorpayPayment = TryCatch(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

 const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
    });
  } else {
    return next(new ErrorHandler("Payment Verification Failed", 400));
  }
});


export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const {amount } = req.body || {};

  if (!amount)
    return next(new ErrorHandler("Please enter  Amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  })
  return res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
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
    productId: productId || null 
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
  
  if (!discountData)
    return next(new ErrorHandler("Invalid Coupon Code", 400));

 
  return res.status(200).json({
    success: true,
    coupon: discountData, 
  });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
 const coupons = await Coupon.find({}).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    coupons,
  });
});


export const getCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findById(id);

  if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

  return res.status(200).json({
    success: true,
    coupon,
  });
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

export const deleteCoupon= TryCatch(async (req, res, next) => {
const { id } = req.params;
const coupon =await Coupon.findByIdAndDelete(id);

if (!coupon)
    return next(new ErrorHandler("Invalid Coupon Code", 400));

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.coupon} Deleted Successfully`,
  });
});
