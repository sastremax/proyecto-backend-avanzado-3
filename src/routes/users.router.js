import CustomRouter from './custom.router.js';
import passport from 'passport';
import {
    githubCallback,
    debugSession,
    getUserByEmail,
    sendPasswordResetEmail,
    validateResetToken,
    resetPassword,
    getAllUsers,
    getUserById,
    deleteUser,
    updateUser
} from '../controllers/users.controller.js';
import passportCall from '../middlewares/passportCall.middleware.js';
import { handlePolicies } from '../middlewares/handlePolicies.middleware.js';

export default class UsersRouter extends CustomRouter {
    init() {

        this.get('/', ['public'], getAllUsers);
        this.get('/:uid', ['public'], getUserById);
        this.get('/by-email:email',
            passportCall('current'),
            handlePolicies(['admin']),
            getUserByEmail);
        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
        this.get('/githubcallback',
            passport.authenticate('github', {
                session: false
            }),
            githubCallback
        );
        this.get('/debug/session', debugSession);
        this.get('/reset-password', [], validateResetToken);
        this.post('/reset-password-request', [], sendPasswordResetEmail);
        this.post('/reset-password', [], resetPassword);
        this.put('/:uid', ['admin'], updateUser);
        this.delete('/:uid', ['admin'], deleteUser);
    }
}