/* 
  David McDowall - Honours Project
  Announcement.js router for handling HTTP requests to /announcement
*/

var express = require('express');
var router = express.Router();
// define Data Access Layers for users and announcements
var announcementDAL = require('../src/announcement/announcement.js');
var userDAL = require('../src/user/user.js');

/* POST post a new announcement message */
router.post('/post', async function (req, res, next) {
  // get announcement from request body and find Staff user
  var announcement = req.body;
  var staff = await userDAL.findUserById(announcement.staffID);
  // handle no staff member found
  if (staff === null) {
    res.send(false);
  }
  else {
    // attempt to create a new announcement
    var success = await announcementDAL.postAnnouncement(announcement.body, announcement.staffID);
    // if successfully created - return true response
    if (success === true) {
      res.send(true);
    }
    // return false response
    else {
      res.send(false);
    }
  }
});

/* GET the latest system announcement */
router.get('/', async function (req, res, next) {
  // attempt to get the latest announcement
  var announcement = await announcementDAL.getLatestAnnouncement();
  // if announcement exists - return announcement
  if (announcement) {
    res.send(announcement);
  }
  // if no announcement found - return false response
  else {
    res.send(false);
  }
});

module.exports = router;
