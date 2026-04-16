import express from "express";
import { stripeWebhook } from "../controllers/webhook.js";
import { razorpayWebhook } from "../controllers/webhook.js";

const app = express.Router();

// Raw body required for Stripe webhook verification
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhook);
app.post("/razorpay", express.raw({ type: "application/json" }), razorpayWebhook);

export default app;