import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedError = [];
    errors.array().map((errors) =>
        extractedError.push({
            [errors.path]: errors.path,
        }),
    );

    throw new ApiError(443, "user validation error");
};
