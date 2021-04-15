/* 
    David McDowall - Honours Project
    Auth.js router for handling authentication HTTP requests to /auth
*/

var express = require('express');
var router = express.Router();
// define Data Access Layers for user and authenticator
var userDAL = require('../src/user/user.js');
var authDAL = require('../src/user/auth.js');

/* POST authenticate a user login */
router.post('/login', async function (req, res, next) {
    // get user from request body and attempt to authenticate user
    var user = req.body;
    var authenticated = await userDAL.authenticateUser(user.email, user.password);
    // if authenticated user found - return authentication response
    if (authenticated._id) {
        res.send(authenticated);
    }
    // else - return non-authenticated response
    else {
        res.send(authenticated);
    }
});

/* POST verify a JSON Web Token */
router.post('/verify', function (req, res) {
    // get token from request body and attempt to verify JWT
    var token = req.body.token;
    var verification = authDAL.verifyJWT(token);
    // if JWT verified and decrypted - return token decrypted
    if (verification != false) {
        res.send(verification);
    }
    //else - return failed message
    else {
        res.send("failed");
    }
});

module.exports = router;
