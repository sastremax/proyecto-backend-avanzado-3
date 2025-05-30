import CustomRouter from './custom.router.js';
import passport from 'passport';
import {
    loginSession,
    registerSession,
    currentSession,
    logoutSession,
    forgotPassword
} from '../controllers/sessions.controller.js';
import { resetPassword } from '../controllers/users.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

export default class SessionsRouter extends CustomRouter {
    init() {
        this.post('/login', ['public'],
            (req, res, next) => {
                passport.authenticate('login', { session: false }, (err, user, info) => {
                    if (err) return next(err);
                    console.log('Logger en router:', typeof req.logger);
                    if (!user) {
                        if (req.logger) {
                            req.logger.warning('Login failed: invalid credentials');
                        } else {
                            console.warn('Login failed: invalid credentials');
                        }
                        return res.unauthorized(info?.message || 'Login failed');
                    }
                    req.user = user;
                    next();
                })(req, res, next);
            },
            loginSession
        );
        this.post('/register', ['public'],
            (req, res, next) => {
                passport.authenticate('register', { session: false }, (err, user, info) => {
                    if (err) return next(err);
                    if (!user) return res.unauthorized(info?.message || 'Registration failed');
                    req.user = user;
                    req.authInfo = info;
                    next();
                })(req, res, next);
            },
            registerSession
        );
        this.get('/current', ['user', 'admin'], currentSession);
        this.post('/forgot-password', ['public'], forgotPassword)
        this.post('/reset-password', ['public'], resetPassword)
        this.get('/logout',
            ['public'],
            ...passportWithPolicy(['user', 'admin']),
            logoutSession);
    }
}