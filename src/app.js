import express from "express"
import route from "./routes/user.routes.js";

console.log("this is working fine for now");

const app = express();

app.use("/api/v1/users", route);

export default app
