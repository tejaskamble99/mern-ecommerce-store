import express from "express";
import { adminOnly, isAuthenticated } from "../middleware/auth.js";
import {
  allOrders,
  cancelOrder,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
  generateInvoice,
} from "../controllers/order.js";

const app = express.Router();

app.post("/new", isAuthenticated, newOrder);

app.get("/my", isAuthenticated, myOrders);

app.patch("/cancel/:id", isAuthenticated, cancelOrder);

app.get("/all", isAuthenticated, adminOnly, allOrders);

app.get("/invoice/:id", isAuthenticated, generateInvoice);

app
  .route("/:id")
  .get(isAuthenticated, getSingleOrder)
  .put(isAuthenticated, adminOnly, processOrder)
  .delete(isAuthenticated, adminOnly, deleteOrder);

export default app;
