import passport from 'passport';

export default function passportCall(strategy) {

    return function (req, res, next) {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            if (!user) return res.unauthorized('Authentication failed');
            req.user = user;
            next();
        })(req, res, next);
    };

}