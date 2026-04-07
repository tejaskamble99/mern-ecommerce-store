import express from "express";
import { getSEO, updateSEO } from "../controllers/seo.js";
import { adminOnly, isAuthenticated } from "../middleware/auth.js";

const app = express.Router();

app.get("/:page", getSEO);

app.put("/:page", isAuthenticated, adminOnly, updateSEO);

export default app;