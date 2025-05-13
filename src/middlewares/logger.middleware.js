export function addTimestamp(req, res, next) {
    logger.http(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}