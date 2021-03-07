var express = require('express');
const { request } = require('../app.js');
var router = express.Router();
var requestDAL = require('../src/request/request.js');
var userDAL = require('../src/user/user.js');

/* GET requests listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST create a new request */
router.post('/create', async function(req, res, next) {
  var request = req.body;
  var student = await userDAL.findUserById(request.studentID);
  var supervisor = await userDAL.findUserById(request.supervisorID);
  if (student===null || supervisor===null) {
    res.send(false);
  }
  else {
    var success = await requestDAL.createRequest(request.title, request.description, request.topic_area, student, supervisor);
    if (success===true) {
        res.send(true);
    }
  }  
});

/* POST update a request */
router.post('/update', async function(req, res, next) {
    var update = req.body;
    var success = await requestDAL.updateRequest(update.id, update);
      if (success===true) {
          res.send(true);
      }
});

/* POST accept a request */
router.post('/accept', async function(req, res, next) {
  var success = await requestDAL.acceptRequest(req.body.requestID);
    if (success===true) {
        res.send(true);
    }
});

/* POST decline a request */
router.post('/decline', async function(req, res, next) {
  var success = await requestDAL.declineRequest(req.body.requestID);
    if (success===true) {
        res.send(true);
    }
});

/* POST delete a request */
router.post('/delete', async function(req, res, next) {
    var request = req.body;
    var success = requestDAL.deleteRequest(request.id);
      if (success===true) {
          res.send(true);
      }
});

router.get('/student/:id', async function(req, res, next) {
  var userID = req.params["id"];
  var requests = await requestDAL.getStudentRequests(userID);
  if (requests) {
    res.send(requests);
  }
  else {
    res.send(false);
  }
});

router.get('/supervisor/:id', async function(req, res, next) {
  var userID = req.params["id"];
  var requests = await requestDAL.getSupervisorRequests(userID);
  if (requests) {
    res.send(requests);
  }
  else {
    res.send(false);
  }
});

module.exports = router;
