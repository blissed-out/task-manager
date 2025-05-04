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
    logoutUser,
} from "../controllers/auth.controllers.js";
import {
    userRegistrationValidation,
    userVerifyValidation,
    userLoginValidation,
    userForgetPasswordValidation,
    userResetPasswordValidation,
    userResendPasswordVerification,
    userResendEmailVerification,
    userChangePasswordValidation,
} from "../validator/index.js";
import { validate } from "../middlewares/validator.middleware.js";

import { Router } from "express";
import { isLoggedIn } from "../middlewares/login.middleware.js";

const route = Router();

route.get("/", home);
route.post("/register", userRegistrationValidation(), validate, registerUser);
route.get("/verify/:token", userVerifyValidation(), validate, verifyUser);
route.post(
    "/forgetPassword",
    userForgetPasswordValidation(),
    validate,
    forgetPassword,
);
route.get(
    "/resetPassword/:token",
    userResetPasswordValidation(),
    validate,
    resetPassword,
);
route.post("/login", userLoginValidation(), validate, loginUser);
route.get("/me", isLoggedIn, validate, getUser);
route.post(
    "/resendEmailVerification",
    userResendEmailVerification(),
    validate,
    refreshEmailVerificationToken,
);

route.post(
    "/changePassword",
    isLoggedIn,
    userChangePasswordValidation(),
    validate,
    changeCurrentPassword,
);

route.get("/logout", isLoggedIn, logoutUser);

export default route;
