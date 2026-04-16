import express from "express";
import { newUser, getAllUsers, getUser, deleteUser } from "../controllers/user.js";
import { adminOnly, isAuthenticated, verifyFirebaseToken } from "../middleware/auth.js";

const app = express.Router();


app.post("/new", verifyFirebaseToken, newUser);

app.get("/me", isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});


app.get("/all", isAuthenticated, adminOnly, getAllUsers);


app.get("/:id", getUser);
app.delete("/:id", isAuthenticated, adminOnly, deleteUser);

export default app;
