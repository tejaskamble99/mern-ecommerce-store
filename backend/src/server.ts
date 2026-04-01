import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import NodeCache from "node-cache";
import Stripe from "stripe";
import { errorMiddleware } from "./middleware/error.js";
import bannerRoute from './routes/banner.js';
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/products.js";
import dashboardRoute from "./routes/stats.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";


config({
  path: "./.env",
});

const stripeKey = process.env.STRIPE_KEY || ""; 
connectDB();

export const stripe = new Stripe(stripeKey)

export const nodeCache = new NodeCache();

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

//Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/banner", bannerRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
