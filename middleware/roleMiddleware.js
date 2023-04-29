const jwt = require('jsonwebtoken');

exports.roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization ?? null;
        if (!token) return res.send('Authorization token is required');

        try {
            const payload = jwt.verify(token, process.env.TOKEN_SECRET);

            if (!payload) return res.send('Unauthorized');

            console.log(payload.existingUser.role.user);

            const rolesArray = allowedRoles;
            const role = payload.existingUser.role.user;

            if (rolesArray.includes(role)) {
                res.send('yvsn2');
                return next();
            }
            return res.send('Unauthorized');
        } catch (error) {
            throw res.send(error);
        }
    };
};
