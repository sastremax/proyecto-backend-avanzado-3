import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './src/config/config.js';
import UserModel from './src/models/user.model.js';
import CartModel from './src/models/cart.model.js';
import { hashPassword } from './src/utils/hash.js';

dotenv.config({
    path: config.mode === 'test' ? './.env.test' : './.env'
});

const run = async () => {
    try {
        console.log('[Script] Connecting to database...');
        await mongoose.connect(config.mongo_uri);

        const existingUser = await UserModel.findOne({ email: 'maxi@example.com' });
        if (existingUser) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const cart = await CartModel.create({ products: [] });

        const newUser = await UserModel.create({
            first_name: 'Maxi',
            last_name: 'Sastre',
            email: 'maxi@example.com',
            password: hashPassword('12345678'),
            role: 'admin',
            cart: cart._id,
            age: 24
        });

        console.log('Admin user created with ID:', newUser._id.toString());
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

run();
