import express from "express";

import { adminOnly, isAuthenticated } from "../middleware/auth.js";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controllers/stats.js";


const app = express.Router();




app.get("/stats", isAuthenticated, adminOnly, getDashboardStats);
app.get("/pie", isAuthenticated, adminOnly, getPieCharts);
app.get("/bar", isAuthenticated, adminOnly, getBarCharts);
app.get("/line", isAuthenticated, adminOnly, getLineCharts);



export default app;
