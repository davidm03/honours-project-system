var express = require('express');
var router = express.Router();
var userDAL = require('../src/user/user.js');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var users = await userDAL.getAllUsers();
  res.send(users);
});

/* GET supervisors listing. */
router.get('/supervisors', async function(req, res, next) {
  var users = await userDAL.getSupervisors();
  res.send(users);
});

/* GET students listing. */
router.get('/students', async function(req, res, next) {
  var users = await userDAL.getStudents();
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
      var existingStudent = await userDAL.getStudentByStudentId(user.studentID); 
      if (existingStudent) {
        res.send({error: "studentID", message: "Student ID already exists."});
      }
      else {
        registered = await userDAL.registerStudent(user.email, user.first_name, user.surname, user.password, user.role, user.studentID);
      }      
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
  var users = req.body.userIDs;
  var success = userDAL.deleteUsers(users);
    if (success===true) {
        res.send(true);
    }
    else {
      res.send(false);
    }
});

router.get('/view/:id', async function(req, res, next) {
  var userID = req.params["id"];
  var user = await userDAL.findUserById(userID);
  if (user) {
    user.password = undefined;
    res.send(user);
  }
  else {
    res.send(false);
  }

});

module.exports = router;
