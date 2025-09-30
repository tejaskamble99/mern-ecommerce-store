import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    // Fail fast - helpful during development & CI
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Re-throw or process.exit(1) depending on how you want your app to behave
    throw err;
  }
};
