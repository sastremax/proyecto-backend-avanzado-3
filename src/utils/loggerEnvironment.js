import { loggers } from './logger.js';
import config from '../config/config.js';

export const logger = config.mode === 'production' ? loggers.prod : loggers.dev;