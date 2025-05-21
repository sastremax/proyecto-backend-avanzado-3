import passport from 'passport';

export const passportWithPolicy = (roles = []) => {
    return [
        passport.authenticate('current', { session: false }),
        (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ status: 'error', error: 'Not authenticated' });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ status: 'error', error: 'Access denied' });
            }

            next();
        }
    ];
};