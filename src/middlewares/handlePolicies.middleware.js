import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function handlePolicies(policies = []) {
    return async (req, res, next) => {
        try {
            if (policies.includes('public')) return next();

            let token;

            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }

            if (!token && req.cookies?.jwtToken) {
                token = req.cookies.jwtToken;
            }
            if (!token) return res.unauthorized('Token missing or malformed');

            const decoded = jwt.verify(token, config.jwt_secret);
            req.user = decoded;

            if (!policies.includes(decoded.role.toUpperCase())) {
                return res.forbidden('Access denied for your role');
            }

            next();
        } catch (error) {
            return res.internalError('Authorization failed', error);
        }
    };
}