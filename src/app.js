import express from "express";
import auth from "./routes/auth.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: [process.env.HOST],
        methods: ["GET", "PUT", "DELETE", "POST"],
    }),
);

app.use("/api/v1/users", auth);

app.use("/api/vi/healthcheck", healthcheckRouter);

export default app;
