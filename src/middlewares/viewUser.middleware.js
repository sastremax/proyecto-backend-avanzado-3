import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function attachUserFromToken(req, res, next) {

    try {
        const token = req.cookies.jwtToken;
        if (!token) return next();

        const decoded = jwt.verify(token, config.jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        next();
    }

}