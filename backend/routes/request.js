var express = require('express');
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
    var success = await requestDAL.createRequest(request.title, request.description, student, supervisor);
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

/* POST delete a request */
router.post('/delete', async function(req, res, next) {
    var request = req.body;
    var success = requestDAL.deleteRequest(request.id);
      if (success===true) {
          res.send(true);
      }
});

module.exports = router;
