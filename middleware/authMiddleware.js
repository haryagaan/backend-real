const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization ?? null;
    console.log(token);

    if (!token) return res.send('Authorization token is required');

    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = decoded.username;
            req.roles = decoded.roles;
            return next();
        });
    } catch (error) {
        throw res.send({ error });
    }
};
