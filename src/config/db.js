import mongoose from 'mongoose';
import config from './config.js';

export const connectToDB = async () => {
    try {
        await mongoose.connect(config.mongo_uri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error(`MongoDB connection failed: ${error.message}`);
    }
}
