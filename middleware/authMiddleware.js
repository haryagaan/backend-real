const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization ?? null;
    console.log(token, 'lala');

    if (!token) return res.send('Authorization token is required');

    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            console.log(token);
            if (err) return res.sendStatus(403);
            return next();
        });
    } catch (error) {
        throw res.send({ error });
    }
};
