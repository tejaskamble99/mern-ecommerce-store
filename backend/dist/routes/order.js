import express from "express";
import { newOrder } from "../controllers/order.js";
const app = express.Router();
// Route - /api/v1/order/new-order
app.post("/new-order", newOrder);
export default app;
//# sourceMappingURL=order.js.map