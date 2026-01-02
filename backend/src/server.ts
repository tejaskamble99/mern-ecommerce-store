import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import { config } from "dotenv";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middleware/error.js";

config({
  path: "./.env",
});
 connectDB();

const port = process.env.PORT ;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
})

//Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`sever is start and tun on  http://localhost:${port}`);
});
