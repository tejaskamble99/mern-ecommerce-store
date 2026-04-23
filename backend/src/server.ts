import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import Stripe from "stripe";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

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

config({ path: "./.env" });

const stripeKey = process.env.STRIPE_KEY || "";
connectDB();

export const stripe = new Stripe(stripeKey);


export const nodeCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const port = process.env.PORT || 4000;
const app = express();



app.use(express.json({ limit: "10mb" }));
app.use(compression());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use((req, res, next) => {
  Object.defineProperty(req, "query", {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
app.use(mongoSanitize());
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});


const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

app.use(generalLimiter);

app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));
app.get("/", (req, res) => res.send("API is running 🚀"));



app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/shipping", shippingRoute);


app.use("/api/v1/payment", sensitiveLimiter, paymentRoute);
app.use("/api/v1/webhook", webhookRoute);

app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/seo", seoRoute);



app.use("/uploads", express.static("uploads"));



app.use(errorMiddleware);



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});