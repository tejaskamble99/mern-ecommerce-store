// utils/features.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.set("strictQuery", true);
mongoose.set("debug", true); // logs queries to console (remove in prod)
export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI environment variable is not set");
    }
    mongoose.connection.on("connected", () => {
        console.log("Mongoose connected to DB:", mongoose.connection.host, "db:", mongoose.connection.name);
    });
    mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
        console.log("Mongoose disconnected");
    });
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};
//# sourceMappingURL=features.js.map