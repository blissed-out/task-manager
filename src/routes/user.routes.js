import { home, register, forgetPassword, login, resetPassword, verifyUser } from "../controllers/auth.controller.js";
import { Router } from "express";

const route = Router();

route.get("/", home);
route.post("/register", register);
route.get("/verify:token", verifyUser);
route.post("/login", login);
route.post("/forgetPassword", forgetPassword);
route.get("/resetPassword", resetPassword);

export default route
