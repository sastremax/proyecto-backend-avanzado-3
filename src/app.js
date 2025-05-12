import express from 'express';
import { connectToDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import SessionsRouter from './routes/sessions.router.js';
import BaseRouter from './routes/base.router.js';
import UsersRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import config from './config/config.js';
import customResponses from './middlewares/customResponses.middleware.js';
import BusinessRouter from './routes/BusinessRouter.js';
import OrdersRouter from './routes/OrdersRouter.js';
import { generateUser } from './utils/generateUser.js';
import { generateProduct } from './utils/generateProduct.js';
import MockRouter from './routes/mock.router.js';

const app = express();
const PORT = config.port;

console.log('DEBUG: this is app.js');
console.log('CONFIG MODE:', config.mode);

if (config.mode === 'dev') {
    console.log('Development mode active');
    console.log('Generated users:');
    for (let i = 0; i < 5; i++) {
        console.log(generateUser());
    }

    console.log('Generated products:');
    for (let i = 0; i < 5; i++) {
        console.log(generateProduct());
    }
    process.exit(0);
}

process.on('uncaughtException', (error) => {
    console.error('UNCAUGHT EXCEPTION:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION:', reason);
    process.exit(1);
});

app.use(express.json());
app.use(customResponses);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: config.secret_key,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session())

app.use('/api/users', new UsersRouter().getRouter());
app.use('/api/sessions', new SessionsRouter().getRouter());
app.use('/api/products', new ProductsRouter().getRouter());
app.use('/api/carts', new CartsRouter().getRouter());
app.use('/base', new BaseRouter().getRouter());
app.use('/api/business', new BusinessRouter().getRouter());
app.use('/api/orders', new OrdersRouter().getRouter());
app.use('/api/mock', MockRouter);
app.use(errorHandler);

const startServer = async () => {
    const { connectToDB } = await import('./config/db.js');
    await connectToDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();