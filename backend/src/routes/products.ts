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
} from "../controllers/product.js";
import { singlUpload } from "../middleware/multer.js";

const app = express.Router();

// Create New Product
app.post("/new", isAuthenticated, adminOnly, singlUpload, newProduct);

// Public Routes
app.get("/latest", getlatestProduct);
app.get("/categories", getAllCategories);
app.get("/categories-with-image", getCategoriesWithImage);
app.get("/all", getAllProducts);

// Admin Products
app.get("/admin-products", isAuthenticated, adminOnly, getAdminProduct);

// Single Product Routes
app
  .route("/:id")
  .get( getSingleProduct)
  .put(isAuthenticated, adminOnly, singlUpload, updateProduct)
  .delete(isAuthenticated, adminOnly, deleteProduct);

export default app;