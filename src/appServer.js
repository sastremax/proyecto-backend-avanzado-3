import app from './appExpress.js';
import { connectToDB } from './config/db.js';
import config from './config/config.js';
import { logger } from './config/logger.environment.js';

const PORT = config.port;

const startServer = async () => {
    if (process.env.NODE_ENV === 'test') {
        logger.info('Skipping startServer() in test mode');
        return;
    }

    try {
        await connectToDB();
        app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
    }
};

export default startServer;
