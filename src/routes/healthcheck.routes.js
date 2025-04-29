import { healthcheck } from "../controllers/healthcheck.controllers.js";
import { Router } from "express";

const route = Router();

route.get("/heathcheck", healthcheck);

export default route;
