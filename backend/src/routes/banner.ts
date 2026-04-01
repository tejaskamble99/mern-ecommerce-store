import express from "express";
import { adminOnly, isAuthenticated } from "../middleware/auth.js"; 

import { singlUpload } from "../middleware/multer.js";
import { addBanner, deleteBanner, getBanners, updateBanner } from "../controllers/banners.js";

const app = express.Router();

// Route - /api/v1/banner/all
// Route - /api/v1/banner/all?slot=hero
app.get("/all", getBanners);

// ✅ FIX: Added isAuthenticated before adminOnly
app.post("/new", isAuthenticated, adminOnly, singlUpload, addBanner);

// ✅ FIX: Added isAuthenticated before adminOnly on PUT and DELETE
app
  .route("/:id")
  .put(isAuthenticated, adminOnly, singlUpload, updateBanner)
  .delete(isAuthenticated, adminOnly, deleteBanner);

export default app;