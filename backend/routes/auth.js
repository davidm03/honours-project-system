var express = require('express');
var router = express.Router();
var userDAL = require('../src/user/user.js');
var authDAL = require('../src/user/auth.js');

/* POST authentication for username and password */
router.post('/login', async function(req, res, next) {
    var user = req.body;
    var authenticated = await userDAL.authenticateUser(user.username, user.password);
    if (authenticated._id) {
        res.send(authenticated);
    }
    else{
        res.send(authenticated);
    }
});

router.post('/verify', function(req, res) {
    var token = req.body.token;
    var verification = authDAL.verifyJWT(token);
    if (verification!=false) {
        res.send(verification);
    }
    else{
        res.send("failed");
    }
});

module.exports = router;
