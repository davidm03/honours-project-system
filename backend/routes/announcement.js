var express = require('express');
var router = express.Router();
var announcementDAL = require('../src/announcement/announcement.js');
var userDAL = require('../src/user/user.js');

/* POST create a new announcement */
router.post('/post', async function(req, res, next) {
  var announcement = req.body;
  var staff = await userDAL.findUserById(announcement.staffID);
  if (staff === null) {
    res.send(false);
  }
  else {
    var success = await announcementDAL.postAnnouncement(announcement.body, announcement.staffID);
    if (success===true) {
        res.send(true);
    }
    else {
        res.send(false);
    }
  }  
});

router.get('/', async function(req, res, next) {
    var announcement = await announcementDAL.getLatestAnnouncement();
    if (announcement) {
      res.send(announcement);
    }
    else {
      res.send(false);
    }
  });

module.exports = router;
