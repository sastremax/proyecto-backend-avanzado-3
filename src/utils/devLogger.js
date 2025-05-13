import winston from 'winston';
import { customLevelOptions } from './customLevels.js';

winston.addColors(customLevelOptions.colors);

export const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple()
            )
        })
    ]
});