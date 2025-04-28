import express from "express";
import auth from "./routes/auth.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

const app = express();

app.use("/api/v1/users", auth);

app.use("/api/vi/healthcheck", healthcheckRouter);

export default app;
