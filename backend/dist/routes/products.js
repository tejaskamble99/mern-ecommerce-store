import express from "express";
import { adminOnly } from '../middleware/auth.js';
import { deleteProduct, getAdminProduct, getAllCategories, getAllProducts, getlatestProduct, getSigleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { singlUpload } from "../middleware/multer.js";
const app = express.Router();
//To Create New Product  - /api/v1/product/new
app.post("/new", adminOnly, singlUpload, newProduct);
//To get last 10 Products  - /api/v1/product/latest
app.get("/latest", getlatestProduct);
//To get all unique Categories  - /api/v1/product/categories
app.get("/categories", getAllCategories);
//To get all Products with filters  - /api/v1/product/all
app.get("/all", getAllProducts);
//To get last 10 Products  - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProduct);
app.route("/:id").get(getSigleProduct).put(adminOnly, singlUpload, updateProduct).delete(adminOnly, deleteProduct);
export default app;
//# sourceMappingURL=products.js.map