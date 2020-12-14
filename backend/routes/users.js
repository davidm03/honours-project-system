var express = require('express');
var router = express.Router();
var userDAL = require('../src/user/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST register new user account */
router.post('/register', async function(req, res, next) {
  var user = req.body;
  var existingUser = await userDAL.findUserByUsername(user.username);
  if (existingUser) {
    res.send({error: "username", message: "Username already in use."});
  }
  else{
    var registered = await userDAL.registerUser(user.username, user.password);
    if (registered===true) {
        res.send(true);
    }
  }
});

module.exports = router;
