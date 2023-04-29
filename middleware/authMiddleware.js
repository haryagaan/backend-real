const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization ?? null;

    if (!token) return res.send('Authorization token is required');

    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            if (err) return res.sendStatus(403);
            return next();
        });
    } catch (error) {
        throw res.send(error);
    }
};
