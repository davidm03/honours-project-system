/* 
    David McDowall - Honours Project
    Project.js class for performing Project functionality
*/

// define Project, Student and Staff models
const Project = require('./project.model');
const Student = require('../user/student.model');
const Staff = require('../user/staff.model');

/*  Function for adding a new project
    Params: project title, description, topic area, availability, status, student ID and supervisor ID
*/
exports.addProject = function (title, description, topic_area, available, status, studentID, supervisorID) {
    return new Promise((resolve, reject) => {
        // create a new project with param information
        var newProject = new Project({
            title,
            description,
            topic_area,
            available,
            status,
            activity: [{ action: "create", activity: "Project created" }],
            studentID,
            supervisorID
        });
        // attempt to save project within DB
        newProject.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                // if project has a student
                if (newProject.studentID) {
                    // update discriminator keys for student
                    Student.findByIdAndUpdate(studentID, { project: newProject._id }, function (err, student) {
                        if (err) {
                            reject(err);
                        }
                    });
                    // update descriminator keys for staff
                    Staff.findByIdAndUpdate(supervisorID, { "$push": { "projects": newProject._id } }, function (err, supervisor) {
                        if (err) {
                            reject(err);
                        }
                    });
                }
                resolve(true);
            }
        });
    });
}

/* Function for finding and returning a project by ID
    Params: project ID
*/
exports.getProject = function (id) {
    return new Promise((resolve, reject) => {
        // search Projects collection within DB for one project with matching ID
        Project.findOne({ _id: id }, function (err, project) {
            // handle errors
            if (err) {
                console.log('Error: Project not found.');
                reject(err);
            }
            // no errors - return project
            else {
                resolve(project);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

/* Function for getting all projects from DB */
exports.getAllProjects = function () {
    return new Promise((resolve, reject) => {
        // attempt to get all projects from DB
        Project.find({}, function (err, projects) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Unable to resolve all projects.');
            }
            // no errors - return projects
            else {
                resolve(projects);
                console.log('Success: All projects resolved.');
            }
        });
    })
}

/* Function for updating a project 
    Params: ID of project to be updated and the updated project JSON object
*/
exports.updateProject = function (id, update) {
    return new Promise((resolve, reject) => {
        // Find project by ID and perform update
        Project.findByIdAndUpdate(id, update, function (err, project) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Failed to update project.');
            }
            // no errors
            else {
                // if update was to add student ID (I.E Student selects pre-defined project)
                if (update.studentID && update.available === false) {
                    // update discriminator keys for student
                    Student.findByIdAndUpdate(update.studentID, { project: project._id }, function (err, student) {
                        if (err) {
                            reject(err);
                        }
                    });
                    // update discriminator keys for staff
                    Staff.findByIdAndUpdate(project.supervisorID, { "$push": { "projects": project._id } }, function (err, supervisor) {
                        if (err) {
                            reject(err);
                        }
                    });
                }
                // success return
                resolve(true);
                console.log('Success: Project status updated.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
};

/* Function for deleting projects from the DB
    Params: Collection of project objects to be deleted
*/
exports.deleteProjects = function (projects) {
    // loop through projects
    for (let index = 0; index < projects.length; index++) {
        // get current project id
        const projectID = projects[index];

        // find project by id and delete project
        Project.findByIdAndDelete(projectID, function (err, doc) {
            // handle errors
            if (err) {
                return false;
            }
            console.log(doc);
        });
    }
    // success response
    return true;
}
