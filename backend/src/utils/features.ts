// utils/features.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { nodeCache } from "../server.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";


dotenv.config();
mongoose.set("strictQuery", true);
mongoose.set("debug", true);

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  mongoose.connection.on("connected", () => console.log("✅ MongoDB Connected"));
  mongoose.connection.on("error", (err) => console.error("❌ MongoDB Error:", err));
  mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB Disconnected"));

  try {

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  } catch (err) {
    console.error("Failed to connect to MongoDB on startup:", err);
    process.exit(1); 
  }
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-Products",
      "categories",
      "all-Products",
      `product-${productId}`,
    ];
    const products = await Product.find({}).select("_id");
    products.forEach((i) =>{
      productKeys.push();
    });
    if(typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((i) => {
        productKeys.push(`product-${i}`);
      });
    }
    nodeCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      `my-orders-${userId}`,
      "all-orders",
      `order-${orderId}`,
    ];
    nodeCache.del(orderKeys);
  }
  if (admin) {
    nodeCache.del("");
  }
};


export const reduceStock= async (orderItems: OrderItemType[]) => {
for(let i=0; i<orderItems.length; i++){
const order = orderItems[i];

  const product = await Product.findById(order.productId);
  if(!product) throw new  Error("Product not found");

    product.stock -= orderItems[i].quantity;
    await product.save();
 
}
}