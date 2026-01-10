import express from "express";
import { adminOnly } from './../middleware/auth.js';
import { newCoupon, applyDiscount, allCoupon, deleteCoupon } from "../controllers/payment.js";
const app = express.Router();
// Route - /api/v1/user/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon);
// Route - /api/v1/user/payment/discount
app.get("/discount", applyDiscount);
// Route - /api/v1/user/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupon);
// Route - /api/v1/user/payment/coupon/:id
app.route("/coupon/:id").delete(adminOnly, deleteCoupon);
export default app;
//# sourceMappingURL=payment.js.map