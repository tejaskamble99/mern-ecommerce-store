import express from "express";

import { adminOnly } from "./../middleware/auth.js";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";

const app = express.Router();

// Route - /api/v1/order/new-order
app.post("/new-order", newOrder);

// Route - /api/v1/order/my
app.get("/my", myOrders);

app.get("/all", adminOnly, allOrders);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
