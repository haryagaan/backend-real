const jwt = require('jsonwebtoken');

exports.roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const tokenBearer = req.headers.authorization ?? null;
        
        const token=tokenBearer.slice(7,tokenBearer.length);

        if (!token) return res.send('Authorization token is required');

        try {
            const payload = jwt.verify(token, process.env.TOKEN_SECRET);

            if (!payload) return res.send('Unauthorized');

            console.log(payload.user.role.user);

            const rolesArray = allowedRoles;
            const role = payload.user.role.user;

            if (!rolesArray.includes(role)) {
                return res.send('Unauthorized');
            }

            return next();
        } catch (error) {
            throw res.send(error);
        }
    };
};
