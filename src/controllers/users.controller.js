import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UsersDTO } from '../dto/UsersDTO.js';
import { UserManager } from '../dao/mongo/UserManager.js';
import { sendRecoveryEmail } from '../utils/mailer.js';
import { hashPassword, isValidPassword } from '../utils/hash.js';

const userManager = new UserManager();

export const githubCallback = (req, res) => {
    const user = req.user;
    try {
        const token = jwt.sign({ id: user._id }, config.jwt_secret, { expiresIn: '1h' });
        res.cookie('jwtToken', token, { httpOnly: true });
        res.success('GitHub login successful', { token });
    } catch (error) {
        res.status(500).json({ error: 'GitHub login error', details: error });
    }
};

export const debugSession = (req, res) => {
    res.success('Session data', {
        session: req.session,
        user: req.user
    });
};

export class UsersController {
    async getUserByEmail(req, res) {
        const { email } = req.params;
        const user = await userManager.getByEmail(email);
        const userDTO = new UsersDTO(user);
        res.json(userDTO);
    }
};

export const getUserByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await userManager.getByEmail(email);
        if (!user) return res.notFound('User not found');
        const userDTO = new UsersDTO(user);
        res.success('User found', userDTO);
    } catch (error) {
        return res.internalError('Error getting user by email', error);
    }
};

export const sendPasswordResetEmail = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await userManager.getByEmail(email);
        if (!user) return res.notFound('User not found');

        const token = jwt.sign(
            { email },
            config.jwt_secret,
            { expiresIn: '1h' }
        );

        await sendRecoveryEmail(email, token);

        res.success('Recovery email sent');
    } catch (error) {
        return res.internalError('Failed to send recovery email', error);
    }

};

export const validateResetToken = (req, res) => {

    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        res.success('Token is valid', { email: decoded.email });
    } catch {
        res.unauthorized('Invalid or expired token');
    }

};

export const resetPassword = async (req, res) => {

    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        const user = await userManager.getByEmail(decoded.email);
        if (!user) return res.notFound('User not found');

        const samePassword = isValidPassword(password, user.password);
        if (samePassword) return res.badRequest('Password must be different from the previous one');

        const hashedPassword = hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        res.success('Password reset successful');
    } catch {
        res.unauthorized('Invalid or expired token');
    }

};