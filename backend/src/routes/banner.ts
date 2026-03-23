import express from "express";
import { adminOnly } from "../middleware/auth.js";

import { singlUpload } from "../middleware/multer.js";
import { addBanner, deleteBanner, getBanners, updateBanner } from "../controllers/banners.js";

const app = express.Router();

// Route - /api/v1/banner/all
// Route - /api/v1/banner/all?slot=hero
app.get("/all", getBanners);

// Route - /api/v1/banner/new?id=adminId
app.post("/new", adminOnly, singlUpload, addBanner);

// Route - /api/v1/banner/:id?id=adminId
app
  .route("/:id")
  .put(adminOnly, singlUpload, updateBanner)
  .delete(adminOnly, deleteBanner);

export default app;
