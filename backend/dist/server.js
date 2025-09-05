import express from "express";
import userRoute from "./routes/user.js";
const port = 8080;
const app = express();
//Routes
app.use("/api/v1/user", userRoute);
app.listen(port, () => {
    console.log(`sever is start and tun on  http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map