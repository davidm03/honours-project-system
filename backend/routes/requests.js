/* 
  David McDowall - Honours Project
  Requests.js router for handling HTTP requests to /requests
*/

var express = require('express');
var router = express.Router();
// define Data Access Layers for requests and users
var requestDAL = require('../src/request/request.js');
var userDAL = require('../src/user/user.js');

/* POST create a new request */
router.post('/create', async function (req, res, next) {
  // get request from request body 
  var request = req.body;
  // find student and supervisor users by ID
  var student = await userDAL.findUserById(request.studentID);
  var supervisor = await userDAL.findUserById(request.supervisorID);
  // handle null user errors
  if (student === null || supervisor === null) {
    res.send(false);
  }
  else {
    // attempt to create new request and return success response
    var success = await requestDAL.createRequest(request.title, request.description, request.topic_area, student, supervisor);
    if (success === true) {
      res.send(true);
    }
  }
});

/* POST update a request */
router.post('/update', async function (req, res, next) {
  // get update from request body and attempt to update request
  var update = req.body;
  var success = await requestDAL.updateRequest(update.id, update);
  // send success response
  if (success === true) {
    res.send(true);
  }
});

/* POST accept a request */
router.post('/accept', async function (req, res, next) {
  // attempt to accept a request and return success response
  var success = await requestDAL.acceptRequest(req.body.requestID);
  if (success === true) {
    res.send(true);
  }
});

/* POST decline a request */
router.post('/decline', async function (req, res, next) {
  // attempt to decline a request and return success response
  var success = await requestDAL.declineRequest(req.body.requestID);
  if (success === true) {
    res.send(true);
  }
});

/* POST delete a request */
router.post('/delete', async function (req, res, next) {
  // get request from request body
  var request = req.body;
  // attempt to delete request by ID and return success response
  var success = requestDAL.deleteRequest(request.id);
  if (success === true) {
    res.send(true);
  }
});

/* GET student requests by ID */
router.get('/student/:id', async function (req, res, next) {
  // get ID from request ID parameter
  var userID = req.params["id"];
  // get student requests and return requests
  var requests = await requestDAL.getStudentRequests(userID);
  if (requests) {
    res.send(requests);
  }
  else {
    res.send(false);
  }
});

/* GET supervisor requests by ID */
router.get('/supervisor/:id', async function (req, res, next) {
  // get ID from request ID paramter
  var userID = req.params["id"];
  // get supervisor requests and return requests
  var requests = await requestDAL.getSupervisorRequests(userID);
  if (requests) {
    res.send(requests);
  }
  else {
    res.send(false);
  }
});

module.exports = router;
