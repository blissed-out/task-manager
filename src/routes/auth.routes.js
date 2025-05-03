import {
    home,
    registerUser,
    forgetPassword,
    loginUser,
    resetPassword,
    verifyUser,
    getUser,
    changeCurrentPassword,
} from "../controllers/auth.controllers.js";

import { Router } from "express";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const route = Router();
route.get("/", home);
route.post("/register", registerUser);
route.get("/verify/:token", verifyUser);
route.post("/forgetPassword", forgetPassword);
route.get("/resetPassword/:token", resetPassword);
route.post("/login", loginUser);
route.get("/me", isLoggedIn, getUser);
route.post("/changeCurrrentPassword", isLoggedIn, changeCurrentPassword);

export default route;
