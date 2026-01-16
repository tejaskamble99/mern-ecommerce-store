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
export const invalidateCache = ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latest-Products",
            "categories",
            "all-Products",
            `product-${productId}`,
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object") {
            productId.forEach((i) => {
                productKeys.push(`product-${i}`);
            });
        }
        nodeCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            `my-orders-${userId}`,
            "all-orders",
            `order-${orderId}`,
        ];
        nodeCache.del(orderKeys);
    }
    if (admin) {
        nodeCache.del([
            "stats",
            "admin-pie-charts",
            "bar-charts",
            "line-charts",
        ]);
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new Error("Product not found");
        product.stock -= orderItems[i].quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
//# sourceMappingURL=features.js.map