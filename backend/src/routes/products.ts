import express from "express";
import { adminOnly, isAuthenticated } from "../middleware/auth.js";
import {
  deleteProduct,
  getAdminProduct,
  getAllCategories,
  getCategoriesWithImage,
  getAllProducts,
  getlatestProduct,
  getSingleProduct,
  newProduct,
  updateProduct,
  addOrUpdateReview,
  getProductReviews,
  deleteReview
} from "../controllers/product.js";

import { singlUpload, multiUpload } from "../middleware/multer.js";

const app = express.Router();

app.post("/new", isAuthenticated, adminOnly, singlUpload, newProduct);

app.get("/latest", getlatestProduct);
app.get("/categories", getAllCategories);
app.get("/categories-with-image", getCategoriesWithImage);
app.get("/all", getAllProducts);

app.get("/admin-products", isAuthenticated, adminOnly, getAdminProduct);

/* ---------------- REVIEW ROUTES FIRST ---------------- */

app.post("/review", isAuthenticated, multiUpload, addOrUpdateReview);
app.delete("/review", isAuthenticated, deleteReview);
app.get("/reviews/:id", getProductReviews);

/* ---------------- PRODUCT ROUTES ---------------- */

app
  .route("/:id")
  .get(getSingleProduct)
  .put(isAuthenticated, adminOnly, singlUpload, updateProduct)
  .delete(isAuthenticated, adminOnly, deleteProduct);

export default app;