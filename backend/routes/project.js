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
  var supervisor = await userDAL.findUserByUsername(project.supervisor.username);
  var success = await projectDAL.addProject(project.title, project.description, project.topic_area, supervisor);
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
    var project = req.body;
    var success = projectDAL.deleteProject(project.id);
      if (success===true) {
          res.send(true);
      }
});

module.exports = router;
