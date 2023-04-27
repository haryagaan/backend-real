const jwt = require('jsonwebtoken');

exports.roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization ?? null;
        if (!token) return res.send('Authorization token is required');

        try {
            const payload = jwt.verify(token, process.env.TOKEN_SECRET);
            console.log(payload, 'lala');
            const result = false;

            if (!payload) return res.send('sa');
            console.log(payload.existingUser.role);
            if (!payload.existingUser.role) return res.send('ZAIL');
            const role = payload.existingUser.role;
            const rolesArray = [...allowedRoles];
            if ((role = rolesArray)) {
                console.log(rolesArray);
                result = true
            }
            if (!result) return res.sendStatus(401);
            next();
        } catch (error) {
            throw res.send({ error });
        }
    };
};
