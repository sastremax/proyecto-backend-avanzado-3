import mongoose from 'mongoose';
import config from './config.js';

export const connectToDB = async () => {
    try {
        await mongoose.connect(config.mongo_uri)
    } catch (error) {
        throw new Error(`MongoDB connection failed: ${error.message}`);
    }
}
