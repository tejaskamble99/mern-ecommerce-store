import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../models/coupon.js";
import { stripe } from "../server.js";
import ErrorHandler from "../utils/utility-class.js";


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
  const { coupon, amount } = req.body || {};

  if (!coupon || !amount)
    return next(new ErrorHandler("Please enter Both Amount and Coupon", 400));

  await Coupon.create({ coupon, amount });
  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon} Created Successfully`,
  });
});

export const applyDiscount= TryCatch(async (req, res, next) => {
  const { coupon} = req.query;

  const discount =  await Coupon.findOne({ coupon });
  if (!discount)
    return next(new ErrorHandler("Invalid Coupon Code", 400));


  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const allCoupon= TryCatch(async (req, res, next) => {

  const coupons =  await Coupon.findOne({ });


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
