import express from "express";
import { adminOnly } from '../middleware/auth.js';
import { getlatestProduct, newProduct } from "../controllers/product.js";
import { singlUpload } from "../middleware/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singlUpload, newProduct);

app.get("/latest", getlatestProduct);

export default app;
