import express from "express";

import userRoute from "./routes/user.js";
import { config } from "dotenv";
import { connectDB } from "./utils/features.js";

config({
  path: "./.env",
});
 connectDB();

const port = process.env.PORT ;
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
})

//Routes
app.use(express.json());
app.use("/api/v1/user", userRoute);


app.listen(port, () => {
  console.log(`sever is start and tun on  http://localhost:${port}`);
});
