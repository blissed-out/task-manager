class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        success = false,
        errors = [],
        stack = "",
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.success = success;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
    }
}

export { ApiError }
