import express from "express";
import { newUser , getAllUsers ,getUser } from "../controllers/user.js";

const app = express.Router();

// Route - /api/v1/user/new
app.post("/new", newUser);

// Route - /api/v1/user/all
app.get("/all", getAllUsers);

// Route - /api/v1/user/dynamicID
app.get("/:id", getUser);

export default app;
