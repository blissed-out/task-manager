import { body, param, cookie } from "express-validator";

const userRegistrationValidation = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email field is required")
            .isEmail()
            .withMessage("Not valid email"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("username field is require")
            .isLength({ min: 3 })
            .withMessage("username must be atleast 3 characters")
            .isLength({ max: 12 })
            .withMessage("username must not be more than 12 characters"),

        body("password")
            .trim()
            .notEmpty()
            .withMessage("password field is required")
            .isLength({ min: 6 })
            .withMessage("password must be atleast 6 characters"),
    ];
};

const userVerifyValidation = () => {
    return [param("token").trim().notEmpty().withMessage("no token found")];
};

const userLoginValidation = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email field is required")
            .isEmail()
            .withMessage("not valid email"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("password field is requried")
            .isLength({ min: 6 })
            .withMessage("password must be atleast 6 characters"),
    ];
};

const userForgetPasswordValidation = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("email field is required")
            .isEmail()
            .withMessage("not valid email"),
    ];
};

const userResetPasswordValidation = () => {
    return [
        param("token").trim().notEmpty().withMessage("no token found"),
        body("new_password")
            .trim()
            .notEmpty()
            .withMessage("password field is required")
            .isLength({ min: 6 })
            .withMessage("Password should be atleast 6 characters"),
    ];
};

const userResendEmailVerification = () => {
    return [cookie("token").trim().notEmpty().withMessage("no token found")];
};
const userResendPasswordVerification = () => {
    return [cookie("token").trim().notEmpty().withMessage("no token found")];
};

const userChangePasswordValidation = () => {
    console.log("user change passwor validation reached");
    return [
        body("new_password")
            .trim()
            .notEmpty()
            .withMessage("password field is required")
            .isLength({ min: 6 })
            .withMessage("password should be atleast 6 characters"),
    ];
};

export {
    userRegistrationValidation,
    userVerifyValidation,
    userLoginValidation,
    userForgetPasswordValidation,
    userResetPasswordValidation,
    userResendEmailVerification,
    userResendPasswordVerification,
    userChangePasswordValidation,
};
