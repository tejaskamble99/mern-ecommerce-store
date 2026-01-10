import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import { config } from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middleware/error.js";
import  NodeCache from "node-cache"
import morgan from "morgan";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

config({
  path: "./.env",
});
 connectDB();

export const nodeCache = new NodeCache();

const port = process.env.PORT ;
const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("hello world");
})

//Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
