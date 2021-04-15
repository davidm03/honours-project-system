/* 
  David McDowall - Honours Project
  Users.js router for handling HTTP requests to /users
*/

var express = require('express');
var router = express.Router();
// define Data Access Layer for users
var userDAL = require('../src/user/user.js');

/* GET all users */
router.get('/', async function (req, res, next) {
  // get and return all users
  var users = await userDAL.getAllUsers();
  res.send(users);
});

/* GET all supervisors */
router.get('/supervisors', async function (req, res, next) {
  // get and return all supervisors
  var users = await userDAL.getSupervisors();
  res.send(users);
});

/* GET all students */
router.get('/students', async function (req, res, next) {
  // get and return all students
  var users = await userDAL.getStudents();
  res.send(users);
});

/* POST register new user account */
router.post('/register', async function (req, res, next) {
  // get user from request body
  var user = req.body;
  // attempt to find if user already exists by email
  var existingUser = await userDAL.findUserByEmail(user.email);
  // if users already exists - send error message
  if (existingUser) {
    res.send({ error: "email", message: "Email already in use." });
  }
  else {
    var registered = false;
    // handle register if user is a staff member
    if (user.role.includes('MODULE_LEADER') || user.role.includes('SUPERVISOR')) {
      registered = await userDAL.registerStaff(user.email, user.first_name, user.surname, user.password, user.role, user.topic_area);
    }
    // handle register if user is student
    else if (user.role.includes('STUDENT')) {
      // check if student ID is already in use
      var existingStudent = await userDAL.getStudentByStudentId(user.studentID);
      // if student ID exists - handle error
      if (existingStudent) {
        res.send({ error: "studentID", message: "Student ID already exists." });
      }
      // register student
      else {
        registered = await userDAL.registerStudent(user.email, user.first_name, user.surname, user.password, user.role, user.studentID);
      }
    }
    // return success response upon successful registration
    if (registered === true) {
      res.send(true);
    }
  }
});

/* POST update a user */
router.post('/update', async function (req, res, next) {
  // get update from request body and attempt to update user by ID
  var update = req.body;
  var success = await userDAL.updateUser(update._id, update);
  // return success response
  if (success === true) {
    res.send(true);
  }
});

/* POST delete a user */
router.post('/delete', async function (req, res, next) {
  // get user IDs of users to be deleted from request bpdy
  var users = req.body.userIDs;
  // attempt to delete users
  var success = userDAL.deleteUsers(users);
  // return success response
  if (success === true) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

/* GET user by ID */
router.get('/view/:id', async function (req, res, next) {
  // get user id from request id parameter
  var userID = req.params["id"];
  // get user
  var user = await userDAL.findUserById(userID);
  // if user found - extract user password and return user
  if (user) {
    user.password = undefined;
    res.send(user);
  }
  // handle error response
  else {
    res.send(false);
  }

});

module.exports = router;
