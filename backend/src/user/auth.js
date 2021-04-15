/* 
    David McDowall - Honours Project
    Auth.js class for performing authentication functionality
*/

// define JSON web token library
const jwt = require('jsonwebtoken');

/* Function for creating a new JWT
    Params: user email, user id, user role, duration of token validity
*/
exports.createJWT = (email, userId, role, duration) => {
    // create token payload
    const payload = {
        email,
        userId,
        role,
        duration
    };

    // sign the token with the secret key and return token
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: duration
    });
};

/* Function for verifying a JSON web token
    Params: JSON Web Token
*/
exports.verifyJWT = (token) => {
    // attempt to decode the JWT using the secret key
    try {
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded;
        // handle errors or failures
    } catch (error) {
        console.log(error);
        return false;
    }
};