import mongoose from 'mongoose';
import config from './config.js';
import { logger } from './logger.environment.js';

export const connectToDB = async () => {

    if (process.env.NODE_ENV === 'test') {
        logger.info('[connectToDB] Skipping MongoDB connection in test mode');
        return;
    }

    try {
        await mongoose.connect(config.mongo_uri);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.error(`Failed to connect to MongoDB: ${error}`);
        throw new Error(`MongoDB connection failed: ${error.message}`);
    }
}
