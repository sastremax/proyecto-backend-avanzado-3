import winston from 'winston';
import { customLevelOptions } from './customLevels.js';

winston.addColors(customLevelOptions.colors);

export const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    level: 'debug',
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp(),
                winston.format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            )
        })
    ]
});