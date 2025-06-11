import { logger } from './config/logger.environment.js';
import config from './config/config.js';
import startServer from './appServer.js';

const dbName = config.mongo_uri.split('/').pop().split('?')[0];

logger.info(`Starting app.js - PID ${process.pid}`);
logger.info(`NODE_ENV: ${config.mode}`);
logger.info(`MongoDB Database: ${dbName}`);

startServer();
