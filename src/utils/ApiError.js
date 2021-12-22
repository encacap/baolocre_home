class ThrowError extends Error {
    constructor(statusCode, message, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.isAPI = true;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ThrowError;
