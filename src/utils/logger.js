import { devLogger } from './devLogger.js';
import { prodLogger } from './prodLogger.js';

export const loggers = {

    dev: devLogger,
    prod: prodLogger

};