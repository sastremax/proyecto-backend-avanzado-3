import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import SessionsRouter from './routes/sessions.router.js';
import BaseRouter from './routes/base.router.js';
import UsersRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import TicketsRouter from './routes/tickets.router.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import config from './config/config.js';
import customResponses from './middlewares/customResponses.middleware.js';
import BusinessRouter from './routes/business.router.js';
import OrdersRouter from './routes/orders.router.js';
import compression from 'compression';
import zlib from 'node:zlib';
import { addLogger } from './middlewares/addLogger.middleware.js';
import { swaggerUi, specs } from './swagger/swagger.config.js';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(customResponses);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({ brotli: { enabled: true, zlib } }));
app.use(addLogger);

app.use(session({
    secret: config.secret_key,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', new UsersRouter().getRouter());
app.use('/api/sessions', new SessionsRouter().getRouter());
app.use('/api/products', new ProductsRouter().getRouter());
app.use('/api/carts', new CartsRouter().getRouter());
app.use('/api/tickets', new TicketsRouter().getRouter());
app.use('/base', new BaseRouter().getRouter());
app.use('/api/business', new BusinessRouter().getRouter());
app.use('/api/orders', new OrdersRouter().getRouter());
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorHandler);

export default app;
