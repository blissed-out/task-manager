import { body } from "express-validator";

const registrationValidation = () => {
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email field is required")
        .isEmail()
        .withMessage("Not valid email");

    body("username")
        .trim()
        .notEmpty()
        .withMessage("username field is require")
        .isLength({ min: 3 })
        .withMessage("username must be atleast 3 characters")
        .isLength({ max: 12 })
        .withMessage("username must not be more than 12 characters");

    body("password")
        .trim()
        .notEmpty()
        .withMessage("password field is required")
        .isLength({ min: 6 })
        .withMessage("password must be atleast 6 characters");
};

export { registrationValidation };
