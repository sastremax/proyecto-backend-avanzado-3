import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserManager } from '../dao/mongo/UserManager.js';
import { hashPassword, isValidPassword } from '../utils/hash.js';
import Cart from '../models/Cart.model.js';
import config from './config.js';

const userManager = new UserManager();

const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
    return req?.cookies?.jwtToken;
};

// inicializo todas las estrategias
const initializePassport = () => {
    // estretegia para registrar usuarios
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

                if (isNaN(numericAge) || numericAge <= 0) {
                    return done(null, false, { message: 'Invalid age' });
                }

                if (numericAge < 13) {
                    return done(null, false, { message: 'minimum age required 13' });
                }

                const exists = await userManager.getByEmail(email)
                if (exists) {
                    return done(null, false, { message: 'User already exists. Change your email, please' });
                }
                const hashedPassword = hashPassword(password);

                const cart = await Cart.create({ products: [] });

                const user = await userManager.createUser({
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                    age,
                    cart: cart._id,
                    role: email === 'adminCoder@coder.com' ? 'admin' : 'user'
                })
                return done(null, user);
            } catch (error) {
                return done(error)
            }
        }
    ));

    // estrategia para login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userManager.getByEmail(email)
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const valid = isValidPassword(password, user.password);
                if (!valid) {
                    return done(null, false, { message: 'Incorrect password' });
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    // estrategia GitHub
    passport.use('github', new GitHubStrategy({
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: 'http://localhost:8080/api/users/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email || `${profile.username}@github.com`
            let user = await userManager.getByEmail(email);
            if (!user) {
                user = await userManager.createUser({
                    first_name: profile.username,
                    last_name: 'GitHubUser',
                    email,
                    password: '',
                    role: profile.username === 'sastremax' ? 'admin' : 'user'
                });
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    // estrategia JWT para extraer usuario desde cookie
    passport.use('current', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
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