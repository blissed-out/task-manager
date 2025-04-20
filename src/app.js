import express from "express";
import route from "./routes/user.routes.js";

const app = express();

app.use("/api/v1/users", route);

export default app;
