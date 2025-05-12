export function authorizationRole(role) {

    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.forbidden(`Access denied: role '${role}' required`);
        }
        next();
    };

}