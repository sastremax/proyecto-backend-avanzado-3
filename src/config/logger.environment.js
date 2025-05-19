import { loggers } from './logger.js';
import config from './config.js';

export const logger = config.mode === 'prod' ? loggers.prod : loggers.dev;