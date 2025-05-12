import CustomRouter from './CustomRouter.js';
import passport from 'passport';
import {
    githubCallback,
    debugSession,
    getUserByEmail,
    sendPasswordResetEmail,
    validateResetToken,
    resetPassword
} from '../controllers/users.controller.js';

export default class UsersRouter extends CustomRouter {
    init() {
        
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

        this.get('/:email', getUserByEmail);
    }
}