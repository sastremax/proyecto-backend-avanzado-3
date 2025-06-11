import { logger } from '../config/logger.environment.js';

export const addLogger = (req, res, next) => {

    req.logger = {
        info: (...params) => logger.info(...params),
        error: (...params) => logger.error(...params),
        warn: (...params) => logger.warn(...params),
        warning: (...params) => logger.warn(...params),
        debug: (...params) => logger.debug(...params),
        http: (...params) => logger.http(...params),
    };

    req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();

};