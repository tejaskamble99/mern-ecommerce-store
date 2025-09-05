import express from "express";

import userRoute from "./routes/user.js";
import { config } from "dotenv";

config({
  path: "./.env",
});
const port = process.env.PORT ;
const app = express();

//Routes
app.use("/api/v1/user", userRoute);

app.listen(port, () => {
  console.log(`sever is start and tun on  http://localhost:${port}`);
});
