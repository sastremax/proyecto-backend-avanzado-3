import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import CartModel from '../models/Cart.model.js';
import { UserModel } from '../models/User.model.js';
import { UsersDTO } from '../dto/UsersDTO.js';
import { UserService } from '../services/UserService.js';

const userService = new UserService();

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

        res.cookie('jwtToken', token, { httpOnly: true });
        res.success('Login successful', { token, user: dtoUser });
    } catch (error) {
        next(error);
    }
};

export const registerSession = async (req, res, next) => {

    try {
        const user = req.user;

        if (!user) {
            return res.badRequest('User registration failed');
        }

        const newCart = await CartModel.create({ products: [] });
        await UserModel.findByIdAndUpdate(user._id, { cart: newCart._id });

        res.created('User registered successfully');

    } catch (error) {
        next(error);
    }

};

export const currentSession = (req, res) => {

    const dtoUser = new UsersDTO(req.user);
    res.success('Current user', dtoUser);
    
};

export const logoutSession = (req, res) => {
    res.clearCookie('jwtToken');
    res.success('Logout successful');
};

export const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) return res.badRequest('Email is required.');

        const user = await userService.getByEmail(email);
        if (!user) return res.notFound('User not found.');

        const token = jwt.sign({ email }, config.jwt_secret, { expiresIn: '1h' });

        const recoveryLink = `http://localhost:8080/api/sessions/reset-password?token=${token}`;

        await sendRecoveryEmail(email, recoveryLink);

        return res.success('Recovery email sent successfully.');
    } catch (error) {
        return res.internalError('Error sending recovery email', error);
    }
    
};