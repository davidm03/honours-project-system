var express = require('express');
var router = express.Router();
var userDAL = require('../src/user/user.js');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var users = await userDAL.getAllUsers();
  res.send(users);
});

/* POST register new user account */
router.post('/register', async function(req, res, next) {
  var user = req.body;
  var existingUser = await userDAL.findUserByEmail(user.email);
  if (existingUser) {
    res.send({error: "email", message: "Email already in use."});
  }
  else{
    var registered = false;
    if (user.role.includes('MODULE_LEADER') || user.role.includes('SUPERVISOR')) {
      registered = await userDAL.registerStaff(user.email, user.first_name, user.surname, user.password, user.role, user.topic_area);
    }
    else if (user.role.includes('STUDENT')){
      registered = await userDAL.registerStudent(user.email, user.first_name, user.surname, user.password, user.role, user.studentID);
    }
    if (registered===true) {
        res.send(true);
    }
  }
});

/* POST update a user */
router.post('/update', async function(req, res, next) {
  var update = req.body;
  var success = await userDAL.updateUser(update._id, update);
    if (success===true) {
        res.send(true);
    }
});

/* POST delete a user */
router.post('/delete', async function(req, res, next) {
  var user = req.body;
  var success = userDAL.deleteUser(user._id);
    if (success===true) {
        res.send(true);
    }
});

module.exports = router;
