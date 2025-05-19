class CustomError extends Error {
    constructor({ message, statusCode = 500, code, cause }) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.cause = cause;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;