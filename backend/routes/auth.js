var express = require('express');
var router = express.Router();
var userDAL = require('../src/user/user');

/* POST authentication for username and password */
router.post('/login', async function(req, res, next) {
    var user = req.body;
    var authenticated = await userDAL.authenticateUser(user.username, user.password);
    if (authenticated===true) {
        res.send(true);
    }
    else{
        res.send(authenticated);
    }
});

module.exports = router;
