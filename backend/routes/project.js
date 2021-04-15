/* 
  David McDowall - Honours Project
  Project.js router for handling HTTP requests to /project
*/

var express = require('express');
var router = express.Router();
// define Data Access Layers for projects and users
var projectDAL = require('../src/project/project.js');
var userDAL = require('../src/user/user.js');

/* GET all projects */
router.get('/', async function (req, res, next) {
  // get and return all projects
  var projects = await projectDAL.getAllProjects();
  res.send(projects);
});

/* POST add a new project */
router.post('/add', async function (req, res, next) {
  // get project from request body
  var project = req.body;
  // check if project has no student attached or not (pre-defined project)
  if (project.noStudent) {
    // create new project without a student
    var success = await projectDAL.addProject(project.title, project.description, project.topic_area, project.available, project.status, null, project.supervisorID);
    // if successfully created - return true response
    if (success === true) {
      res.send(true);
    }
  }
  // else project has a student attached
  else {
    // find student by id
    var student = await userDAL.getStudentByStudentId(project.studentID);
    // if student found
    if (student != null) {
      // attempt to create new project and return success response
      var success = await projectDAL.addProject(project.title, project.description, project.topic_area, project.available, project.status, student._id, project.supervisorID);
      if (success === true) {
        res.send(true);
      }
    }
    // if no student found - return student error response
    else {
      res.send({ error: "student", message: "Student ID does not exist." })
    }
  }
});

/* POST update a project */
router.post('/update', async function (req, res, next) {
  // get updated project from request body and find associated student
  var updatedProject = req.body;
  var student = await userDAL.findUserById(updatedProject.studentID);
  // if student not found - attempt different lookup
  if (!student) {
    student = await userDAL.getStudentByStudentId(updatedProject.studentID);
  }
  // if student found - update the project and return success response
  if (student != null) {
    updatedProject.studentID = student._id;
    var success = await projectDAL.updateProject(updatedProject._id, updatedProject);
    if (success === true) {
      res.send(true);
    }
  }
  // handle no student found error
  else {
    res.send({ error: "Student", message: "Student ID does not exist." });
  }

});

/* POST delete a project */
router.post('/delete', async function (req, res, next) {
  // find project IDs of projects to be deleted from request and attempt to delete projects
  var projects = req.body.projectIDs;
  var success = projectDAL.deleteProjects(projects);
  // return success response
  if (success === true) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

/* GET project by ID */
router.get('/view/:id', async function (req, res, next) {
  // get project ID from request ID paramater
  var projectID = req.params["id"];
  // find project by ID and return details
  var project = await projectDAL.getProject(projectID);
  if (project) {
    res.send(project);
  }
  else {
    res.send(false);
  }
});

module.exports = router;
