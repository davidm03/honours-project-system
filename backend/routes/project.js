var express = require('express');
var router = express.Router();
var projectDAL = require('../src/project/project.js');
var userDAL = require('../src/user/user.js');

/* GET projects listing. */
router.get('/', async function(req, res, next) {
  var projects = await projectDAL.getAllProjects();
  res.send(projects);
});

/* POST add a new project */
router.post('/add', async function(req, res, next) {
  var project = req.body;
  var success = await projectDAL.addProject(project.title, project.description, project.topic_area);
    if (success===true) {
        res.send(true);
    }
});

/* POST update a project */
router.post('/update', async function(req, res, next) {
    var updatedProject = req.body;
    var success = await projectDAL.updateProject(updatedProject._id, updatedProject);
      if (success===true) {
          res.send(true);
      }
});

/* POST delete a project */
router.post('/delete', async function(req, res, next) {
  var projects = req.body.projectIDs;
  var success = projectDAL.deleteProjects(projects);
    if (success===true) {
        res.send(true);
    }
    else {
      res.send(false);
    }
});

module.exports = router;
