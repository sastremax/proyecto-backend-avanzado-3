import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import CartModel from '../models/cart.model.js'
import { UsersDTO } from '../dto/users.dto.js';
import userService from '../services/user.service.js';

export const loginSession = (req, res, next) => {
    try {
        const dtoUser = userService.formatUser(req.user);
        const payload = {
            id: req.user.id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: dtoUser.email,
            role: dtoUser.role
        };
        const token = jwt.sign(payload, config.jwt_secret, { expiresIn: '1h' });

        req.logger.info(`User logged in: ${dtoUser.email}`);
        res.success('Login successful', { token, user: dtoUser });
    } catch (error) {
        req.logger.error(`Login error: ${error.message}`);
        next(error);
    }
};

export const registerSession = async (req, res, next) => {

    try {
        console.log('ENTERED registerSession');
        console.log('req.user:', req.user);
        const user = req.user;

        if (!user) {
            console.warn('User is missing');
            req.logger.warning('User registration failed');
            return res.badRequest('User registration failed');
        }

        const newCart = await CartModel.create({ products: [] });
        console.log('Cart created with ID:', newCart._id);

        await userService.assignCartToUser(user._id, newCart._id);
        console.log('Cart assigned to user');

        req.logger.info(`User registered: ${user.email}`);
        res.created('User registered successfully', userService.formatUser(user));

    } catch (error) {
        console.error('ERROR in registerSession:', error.message);
        req.logger.error(`Registration error: ${error.message}`);
        next(error);
    }

};

export const currentSession = (req, res) => {

    const { first_name, last_name, email, age, role, cart } = req.user
    req.logger.info(`Current session retrieved for: ${email}`);
    res.success('Current user', { first_name, last_name, email, age, role, cart });

};

export const logoutSession = (req, res) => {
    req.logger.info(`User logged out: ${req.user?.email || 'unknown'}`);
    res.success('Logout successful');
};

export const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;
        req.logger.warning('Forgot password request missing email');
        if (!email) return res.badRequest('Email is required.');

        const user = await userService.getByEmail(email);
        if (!user) return res.notFound('User not found.');
        req.logger.warning(`Forgot password: user not found for email ${email}`);
        const token = jwt.sign({ email }, config.jwt_secret, { expiresIn: '1h' });

        const recoveryLink = `http://localhost:8080/api/sessions/reset-password?token=${token}`;

        await sendRecoveryEmail(email, recoveryLink);

        req.logger.info(`Recovery email sent to: ${email}`);
        return res.success('Recovery email sent successfully.');
    } catch (error) {
        req.logger.error(`Forgot password error: ${error.message}`);
        return res.internalError('Error sending recovery email', error);
    }

};