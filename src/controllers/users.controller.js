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
        req.logger.info(`GitHub login successful for user: ${user.email}`);
        res.success('GitHub login successful', { token });
    } catch (error) {
        req.logger.error(`GitHub login error: ${error.message}`);
        res.status(500).json({ error: 'GitHub login error', details: error });
    }
};

export const debugSession = (req, res) => {
    req.logger.debug(`Session data requested by ${req.user?.email || 'unknown'}`);
    res.success('Session data', {
        session: req.session,
        user: req.user
    });
};

export class UsersController {

    async getUserByEmail(req, res) {
        const { email } = req.params;

        try {
            const user = await userManager.getByEmail(email);
            const userDTO = new UsersDTO(user);
            req.logger.info(`User fetched via UsersController by email: ${email}`);
            res.json(userDTO);

        } catch (error) {
            req.logger.error(`Error in UsersController.getUserByEmail: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }

    }

};

export const getUserByEmail = async (req, res) => {

    const { email } = req.params;
    try {
        const user = await userManager.getByEmail(email);
        if (!user) {
            req.logger.info(`User not found by email: ${email}`);
            return res.notFound('User not found');
        }
        const userDTO = new UsersDTO(user);
        req.logger.info(`User found by email: ${email}`);
        res.success('User found', userDTO);

    } catch (error) {
        req.logger.error(`Error retrieving user by email: ${error.message}`);
        return res.internalError('Error getting user by email', error);
    }

};

export const sendPasswordResetEmail = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await userManager.getByEmail(email);
        if (!user) {
            req.logger.warning(`Password reset request for non-existent email: ${email}`);
            return res.notFound('User not found');
        }

        const token = jwt.sign(
            { email },
            config.jwt_secret,
            { expiresIn: '1h' }
        );

        await sendRecoveryEmail(email, token);
        req.logger.info(`Password reset email sent to: ${email}`);
        res.success('Recovery email sent');

    } catch (error) {
        req.logger.error(`Error sending password reset email: ${error.message}`);
        return res.internalError('Failed to send recovery email', error);
    }

};

export const validateResetToken = (req, res) => {

    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        req.logger.info(`Password reset token validated for: ${decoded.email}`);
        res.success('Token is valid', { email: decoded.email });

    } catch {
        req.logger.warning('Invalid or expired password reset token');
        res.unauthorized('Invalid or expired token');
    }

};

export const resetPassword = async (req, res) => {

    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        const user = await userManager.getByEmail(decoded.email);
        if (!user) {
            req.logger.warning(`Password reset failed: user not found for ${decoded.email}`);
            return res.notFound('User not found');
        }

        const samePassword = isValidPassword(password, user.password);
        if (samePassword) {
            req.logger.warning(`Password reset failed: same password used for ${decoded.email}`);
            return res.badRequest('Password must be different from the previous one');
        }

        const hashedPassword = hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        req.logger.info(`Password reset successful for: ${decoded.email}`);
        res.success('Password reset successful');

    } catch {
        req.logger.warning('Invalid or expired password reset token');
        res.unauthorized('Invalid or expired token');
    }

};