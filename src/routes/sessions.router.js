import CustomRouter from './CustomRouter.js';
import passport from 'passport';
import { handlePolicies } from '../middlewares/handlePolicies.js';
import {
    loginSession,
    registerSession,
    currentSession,
    logoutSession,
    forgotPassword
} from '../controllers/sessions.controller.js';
import { resetPassword } from '../controllers/users.controller.js';

export default class SessionsRouter extends CustomRouter {
    init() {
        // login con passport y generación de JWT
        this.post('/login',
            (req, res, next) => {

                passport.authenticate('login', { session: false }, (err, user, info) => {
                    if (err) return next(err);
                    if (!user) return res.unauthorized(info?.message || 'Login failed');
                    req.user = user;
                    next();
                })(req, res, next);
            },
            loginSession
        );

        // registro con passport
        this.post('/register',
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

        // current
        this.get('/current',
            passport.authenticate('current', { session: false }),
            handlePolicies(['USER', 'ADMIN']),
            currentSession
        );

        // password perdido
        this.post('/forgot-password', forgotPassword)
        // password reseteado
        this.post('/reset-password', resetPassword)

        // logout
        this.get('/logout', logoutSession);
    }
}