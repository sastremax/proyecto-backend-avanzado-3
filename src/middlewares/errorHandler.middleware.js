export default function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const code = err.code || 'UNHANDLED_ERROR';
    const cause = err.cause || 'Unknown';

    res.status(status).json({
        status: 'error',
        error: message,
        code,
        cause
    });
}