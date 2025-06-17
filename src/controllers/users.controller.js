import UserService from '../services/user.service.js';
import { sendRecoveryEmail } from '../utils/mailer.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers()
        res.status(200).json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users
        })
    } catch (error) {
        req.logger?.error(`Failed to get users: ${error.message}`);
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await UserService.getUserById(uid);
        if (!user) {
            req.logger?.warning(`User not found: ${uid}`);
            return res.notFound('User not found');
        }

        req.logger?.info(`User retrieved by ID: ${uid}`);
        res.success('User found', user);
    } catch (error) {
        req.logger?.error(`Error retrieving user by ID: ${error.message}`);
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const updateData = req.body;
        const updatedUser = await UserService.updateUserById(uid, updateData);

        req.logger?.info(`User updated: ${uid}`);
        res.success('User updated successfully', updatedUser);
    } catch (error) {
        req.logger?.error(`Error updating user: ${error.message}`);
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const deletedUser = await UserService.deleteUserById(uid);

        req.logger?.info(`User deleted: ${uid}`);
        res.success('User deleted successfully', deletedUser);
    } catch (error) {
        req.logger?.error(`Error deleting user: ${error.message}`);
        next(error);
    }
};

export const githubCallback = (req, res) => {
    const user = req.user;
    try {
        const token = UserService.generateToken(user);
        res.cookie('jwtToken', token, { httpOnly: true });
        req.logger.info(`GitHub login successful for user: ${user.email}`);
        res.success('GitHub login successful', { token });
    } catch (error) {
        req.logger.error(`GitHub login error: ${error.message}`);
        return res.internalError('GitHub login error', error);
    }
};

export const debugSession = (req, res) => {
    req.logger.debug(`Session data requested by ${req.user?.email || 'unknown'}`);
    res.success('Session data', {
        user: req.user
    });
};



export const getUserByEmail = async (req, res) => {
    const { email } = req.params;

    if (req.user?.role !== 'admin') {
        req.logger.warning(`Unauthorized access attempt by ${req.user?.email || 'unknown'}`);
        return res.forbidden('Only administrators can access this resource.');
    }

    try {
        const userDTO = await UserService.getUserByEmail(email);
        if (!userDTO) {
            req.logger.info(`User not found by email: ${email}`);
            return res.notFound('User not found');
        }

        req.logger.info(`User found by email: ${email}`);
        res.success('User found', userDTO);

    } catch (error) {
        req.logger.error(`Error retrieving user by email: ${error.message}`);
        return res.internalError('Error getting user by email');
    }
};

export const sendPasswordResetEmail = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await UserService.getRawUserByEmail(email);
        if (!user) {
            req.logger.warning(`Password reset request for non-existent email: ${email}`);
            return res.notFound('User not found');
        }

        const token = UserService.generateToken(user);
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
        const decoded = UserService.verifyResetToken(token);
        req.logger.info(`Password reset token validated for: ${decoded.email}`);
        res.success('Token is valid', { email: decoded.email });

    } catch {
        req.logger.warning('Invalid or expired password reset token');
        res.unauthorized('Invalid or expired token');
    }

};

export const resetPassword = async (req, res) => {
    const token = req.query.token;
    const { password } = req.body;

    try {
        const decoded = UserService.verifyResetToken(token);
        const user = await UserService.getRawUserByEmail(decoded.email);
        if (!user) {
            req.logger.warning(`Password reset failed: user not found for ${decoded.email}`);
            return res.notFound('User not found');
        }

        const samePassword = UserService.isSamePassword(password, user.password);
        if (samePassword) {
            req.logger.warning(`Password reset failed: same password used for ${decoded.email}`);
            return res.badRequest('Password must be different from the previous one');
        }

        const hashedPassword = UserService.hashNewPassword(password);
        await UserService.updateUserPassword(user, hashedPassword);

        req.logger.info(`Password reset successful for: ${decoded.email}`);
        res.success('Password reset successful');

    } catch {
        req.logger.warning('Invalid or expired password reset token');
        res.unauthorized('Invalid or expired token');
    }

};
