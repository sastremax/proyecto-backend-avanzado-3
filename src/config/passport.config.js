import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserManager } from '../dao/mongo/user.manager.js';
import CartModel from '../models/cart.model.js';
import config from './config.js';
import userService from '../services/user.service.js';
import { isValidPassword } from '../utils/hash.js';

const userManager = new UserManager();

const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
    return req?.cookies?.jwtToken;
};

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age } = req.body

                const numericAge = Number(age);
                if (!first_name || !last_name || !email || !password || !age) {
                    return done(null, false, { message: 'All fields are required' });
                }

                if (!email.includes('@')) {
                    return done(null, false, { message: 'Invalid email format' });
                }

                if (password.length < 8) {
                    return done(null, false, { message: 'Password must be at least 8 characters' });
                }

                if (Number.isNaN(numericAge) || numericAge <= 0) {
                    return done(null, false, { message: 'Invalid age' });
                }

                if (numericAge < 13) {
                    return done(null, false, { message: 'minimum age required 13' });
                }

                const exists = await userManager.getByEmail(email)
                if (exists) {
                    return done(null, false, { message: 'User already exists. Change your email, please' });
                }

                const cart = await CartModel.create({ products: [] });

                const user = await userService.create({
                    first_name,
                    last_name,
                    email,
                    password,
                    age,
                    cart: cart._id,
                    role: email === 'adminCoder@coder.com' ? 'admin' : 'user'
                });

                return done(null, user);
            } catch (error) {
                return done(error)
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userManager.getByEmail(email)
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                console.log('Entered password:', password);
                console.log('Entered password length:', password.length);
                console.log('Stored hash:', user.password);
                const valid = await isValidPassword(password, user.password);
                console.log('Password match:', valid);
                if (!valid) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    //if (config.mode !== 'test') {
    //    passport.use('github', new GitHubStrategy({
    //        clientID: config.github_client_id,
    //        clientSecret: config.github_client_secret,
    //        callbackURL: 'http://localhost:8080/api/users/githubcallback'
    //    }, async (accessToken, refreshToken, profile, done) => {
    //        try {
    //            const email = profile._json.email || `${profile.username}@github.com`
    //            let user = await userManager.getByEmail(email);
    //            if (!user) {
    //                user = await userManager.createUser({
    //                    first_name: profile.username,
    //                    last_name: 'GitHubUser',
    //                    email,
    //                    password: '',
    //                    role: profile.username === 'sastremax' ? 'admin' : 'user'
    //                });
    //            }
    //            return done(null, user)
    //        } catch (error) {
    //            return done(error)
    //        }
    //    }));
    //}

    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwt_secret
        },
        async (jwtPayload, done) => {
            try {
                console.log('JWT Payload ID:', jwtPayload.id);
                const user = await userService.getUserById(jwtPayload.id);
                console.log('User from DB:', user);
                if (!user) return done(null, false, { message: 'User not found' });
                return done(null, {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                });
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('jwt-bearer', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwt_secret
        },
        async (jwtPayload, done) => {
            try {
                const user = await userManager.getById(jwtPayload.id);
                if (!user) return done(null, false, { message: 'User not found' });
                return done(null, {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role
                });
            } catch (error) {
                return done(error);
            }
        }
    ));

};

export default initializePassport