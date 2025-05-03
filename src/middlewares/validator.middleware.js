import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    console.log("errors is: ", errors);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedError = [];
    errors.array().map((err) =>
        extractedError.push({
            [err.path]: err.msg,
        }),
    );

    res.status(443).json(
        new ApiError(443, "user validation error", extractedError),
    );
    // throw new ApiError(443, "user validation error");
};
