import mongoose from 'mongoose';
import config from './config.js';
import { logger } from './loggerEnvironment.js';

export const connectToDB = async () => {
    try {
        await mongoose.connect(config.mongo_uri);
        logger.info('Connected to MongoDB');
    } catch (error) {
        logger.fatal(`Failed to connect to MongoDB: ${error}`);
        throw new Error(`MongoDB connection failed: ${error.message}`);
    }
}
