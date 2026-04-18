import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import Stripe from "stripe";
import rateLimit from "express-rate-limit";

import { errorMiddleware } from "./middleware/error.js";
import bannerRoute from "./routes/banner.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/products.js";
import dashboardRoute from "./routes/stats.js";
import userRoute from "./routes/user.js";
import seoRoute from "./routes/seo.js";
import { connectDB } from "./utils/features.js";
import webhookRoute from "./routes/webhook.js";
import shippingRoute from "./routes/shipping.js";



config({
  path: "./.env",
});

const stripeKey = process.env.STRIPE_KEY || "";
connectDB();

export const stripe = new Stripe(stripeKey);
export const nodeCache = new NodeCache();

const port = process.env.PORT || 4000;
const app = express();

/* ---------- GLOBAL MIDDLEWARE ---------- */

app.use(express.json({ limit: "10mb" }));
app.set("trust proxy", 1);

app.use(morgan("dev"));



app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ---------- ROUTES ---------- */

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/shipping", shippingRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/webhook", webhookRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/seo", seoRoute);

/* ---------- STATIC FILES ---------- */

app.use("/uploads", express.static("uploads"));

/* ---------- ERROR HANDLER ---------- */

app.use(errorMiddleware);

/* ---------- SERVER ---------- */

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});