// utils/features.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { nodeCache } from "../server.js";
import { Product } from "../models/product.js";
dotenv.config();
mongoose.set("strictQuery", true);
mongoose.set("debug", true);
export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not set");
    }
    mongoose.connection.on("connected", () => console.log("✅ MongoDB Connected"));
    mongoose.connection.on("error", (err) => console.error("❌ MongoDB Error:", err));
    mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB Disconnected"));
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }
    catch (err) {
        console.error("Failed to connect to MongoDB on startup:", err);
        process.exit(1);
    }
};
export const invalidateCache = async ({ product, order, admin, }) => {
    if (product) {
        const productKeys = [
            "latest-Products",
            "categories",
            "all-Products",
        ];
        const products = await Product.find({}).select("_id");
        products.forEach((i) => {
            productKeys.push(`product-${i._id}`);
        });
        nodeCache.del(productKeys);
    }
    if (order) {
        nodeCache.del("");
    }
    if (admin) {
        nodeCache.del("");
    }
};
//# sourceMappingURL=features.js.map