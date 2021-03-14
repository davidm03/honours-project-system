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
  if (project.noStudent) {
    var success = await projectDAL.addProject(project.title, project.description, project.topic_area, project.available, project.status, null, project.supervisorID);
      if (success===true) {
          
          res.send(true);
      }
  }
  else {
    var student = await userDAL.getStudentByStudentId(project.studentID);
    if (student!=null) {
      var success = await projectDAL.addProject(project.title, project.description, project.topic_area, project.available, project.status, student._id, project.supervisorID);
      if (success===true) {
          res.send(true);
      }
    }
    else {
      res.send({error: "student", message: "Student ID does not exist."})
    }
  }
});

/* POST update a project */
router.post('/update', async function(req, res, next) {
    var updatedProject = req.body;
    var student = await userDAL.findUserById(updatedProject.studentID);
    if (!student) {
      student = await userDAL.getStudentByStudentId(updatedProject.studentID);
    }
    if (student!=null) {
      updatedProject.studentID = student._id;
      var success = await projectDAL.updateProject(updatedProject._id, updatedProject);
      if (success===true) {
          res.send(true);
      }
    }
    else {
      res.send({error: "Student", message: "Student ID does not exist."});
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

router.get('/view/:id', async function(req, res, next) {
  var projectID = req.params["id"];
  var project = await projectDAL.getProject(projectID);
  if (project) {
    res.send(project);
  }
  else {
    res.send(false);
  }
});

module.exports = router;
