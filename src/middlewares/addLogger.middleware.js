import { logger } from '../config/logger.environment.js';

export const addLogger = (req, res, next) => {

    req.logger = logger;

    req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();

};