const jwt = require('jsonwebtoken');

exports.tokenGenerator = (payload) => {
    const token = jwt.sign({ payload }, process.env.TOKEN_SECRET, {
        expiresIn: '3d',
    });
    return token;
};
