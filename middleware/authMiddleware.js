const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const tokenBearer = req.headers.authorization ?? null;

    const token=tokenBearer.slice(7,tokenBearer.length);

    // console.log(token)

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
