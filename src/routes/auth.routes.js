import {
    home,
    registerUser,
    forgetPassword,
    loginUser,
    resetPassword,
    verifyUser,
    getUser,
    changeCurrentPassword,
    refreshEmailVerificationToken,
    refreshResetPasswordVerificationToken,
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
route.post("/me", isLoggedIn, getUser);
route.post("/resendEmailVerification", refreshEmailVerificationToken);
route.post("/resendResetPassword", refreshResetPasswordVerificationToken);
route.post("/changePassword", isLoggedIn, changeCurrentPassword);

export default route;
