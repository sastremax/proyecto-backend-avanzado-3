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
import BusinessRouter from './routes/business.router.js';
import OrdersRouter from './routes/orders.router.js';
import MockRouter from './routes/mocks.router.js';
import compression from 'compression';
import zlib from 'node:zlib';
import { addLogger } from './middlewares/addLogger.middleware.js';
import { logger } from './config/logger.environment.js';
import { swaggerUi, specs } from './swagger/swagger.config.js'

const app = express();

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = config.port;

process.on('uncaughtException', (error) => {
    logger.fatal(`UNCAUGHT EXCEPTION: ${error.message}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.fatal(`UNHANDLED REJECTION: ${reason}`);
    process.exit(1);
});

app.use(express.json());
app.use(addLogger);
app.use(customResponses);
app.use(express.urlencoded({ extended: true }));

if (config.mode === 'production') {
    app.use(compression({
        brotli: {
            enabled: true,
            zlib: zlib.createBrotliCompress
        }
    }));
}

app.use(cookieParser());

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
app.use('/base', new BaseRouter().getRouter());
app.use('/api/business', new BusinessRouter().getRouter());
app.use('/api/orders', new OrdersRouter().getRouter());
app.use('/api/mocks', MockRouter);

app.get('/loggerTest', (req, res) => {
    req.logger.debug('DEBUG level log');
    req.logger.http('HTTP level log');
    req.logger.info('INFO level log');
    req.logger.warning('WARNING level log');
    req.logger.error('ERROR level log');
    req.logger.fatal('FATAL level log');
    res.send('Logs generated successfully');
});

app.get('/test/user', (req, res) => {
    res.status(200).json({ message: 'Endpoint /test/user activo' });
});

app.use(errorHandler);

const startServer = async () => {
    try {
        logger.info(`Worker PID ${process.pid} running Express on port ${PORT}`);
        const { connectToDB } = await import('./config/db.js');
        await connectToDB();

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        logger.fatal(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

export default startServer;
