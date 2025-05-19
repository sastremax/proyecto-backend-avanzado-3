import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import CartModel from '../models/Cart.model.js';
import { UserModel } from '../models/User.model.js';
import { UsersDTO } from '../dto/UsersDTO.js';
import userService from '../services/UserService.js';

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

        res.cookie('jwtToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        req.logger.info(`User logged in: ${dtoUser.email}`);
        res.success('Login successful', { token, user: dtoUser });
    } catch (error) {
        req.logger.error(`Login error: ${error.message}`);
        next(error);
    }
};

export const registerSession = async (req, res, next) => {

    try {
        const user = req.user;

        if (!user) {
            req.logger.warning('User registration failed');
            return res.badRequest('User registration failed');
        }

        const newCart = await CartModel.create({ products: [] });
        await UserModel.findByIdAndUpdate(user._id, { cart: newCart._id });

        req.logger.info(`User registered: ${user.email}`);
        res.created('User registered successfully');

    } catch (error) {
        req.logger.error(`Registration error: ${error.message}`);
        next(error);
    }

};

export const currentSession = (req, res) => {

    const dtoUser = new UsersDTO(req.user);
    req.logger.info(`Current session retrieved for: ${dtoUser.email}`);
    res.success('Current user', dtoUser);

};

export const logoutSession = (req, res) => {
    req.logger.info(`User logged out: ${req.user?.email || 'unknown'}`);
    res.clearCookie('jwtToken');
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