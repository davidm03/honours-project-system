const jwt = require('jsonwebtoken');

exports.createJWT = (username, userId, duration) => {
    const payload = {
        username,
        userId,
        duration
    };

    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: duration
    });
};

exports.verifyJWT = (token) => {
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded;
    } catch (error) {
        console.log(error);
        return false;
    }
};