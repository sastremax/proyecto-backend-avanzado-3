import winston from 'winston';
import { customLevelOptions } from '../config/customLevels.js';

winston.addColors(customLevelOptions.colors);

export const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'warning',
            format: winston.format.simple()
        })
    ]
});