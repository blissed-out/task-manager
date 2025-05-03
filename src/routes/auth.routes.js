import {
    home,
    registerUser,
    forgetPassword,
    loginUser,
    resetPassword,
    verifyUser,
    getUser,
} from "../controllers/auth.controllers.js";
import {
    userRegistrationValidation,
    userVerifyValidation,
    userLoginValidation,
    userForgetPasswordValidation,
    userResetPasswordValidation,
    userLoginMiddlewareValidation,
} from "../validator/index.js";
import { validate } from "../middlewares/validator.middleware.js";

import { Router } from "express";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const route = Router();
route.get("/", home);
route.post("/register", userRegistrationValidation(), validate, registerUser);
route.get("/verify/:token", userVerifyValidation(), verifyUser);
route.post("/forgetPassword", userForgetPasswordValidation(), forgetPassword);
route.get(
    "/resetPassword/:token",
    userResetPasswordValidation(),
    resetPassword,
);
route.post("/login", userLoginValidation(), loginUser);
route.get("/me", userLoginMiddlewareValidation(), isLoggedIn, getUser);

export default route;
