import express from "express";
import { adminOnly, isAuthenticated } from "../middleware/auth.js";

import {
  newCoupon,
  applyDiscount,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  getCoupon,
  createPaymentIntent,
} from "../controllers/payment.js";

const app = express.Router();

// Payment
app.post("/create", isAuthenticated, createPaymentIntent);

// Coupon routes
app.post("/coupon/new", isAuthenticated, adminOnly, newCoupon);

app.get("/discount", applyDiscount);

app.get("/coupon/all", isAuthenticated, adminOnly, getAllCoupons);

app
  .route("/coupon/:id")
  .delete(isAuthenticated, adminOnly, deleteCoupon)
  .put(isAuthenticated, adminOnly, updateCoupon)
  .get(isAuthenticated, adminOnly, getCoupon);

export default app;