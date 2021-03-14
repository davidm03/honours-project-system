const Project = require('./project.model');
const Student = require('../user/student.model');
const Staff = require('../user/staff.model');

exports.addProject = function (title, description, topic_area, available, status, studentID, supervisorID) {
    return new Promise((resolve, reject) => {
        var newProject = new Project({
            title,
            description,
            topic_area,
            available,
            status,
            activity: [{ action: "create", activity: "Project created"}],
            studentID,
            supervisorID
        });
        newProject.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                if (newProject.studentID) {
                    //update discriminator keys
                    Student.findByIdAndUpdate(studentID, {project: newProject._id}, function (err, student) {
                        if (err) {
                            reject(err);
                        }
                    }); 
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

exports.getProject = function (id) {
    return new Promise((resolve, reject) => {
        Project.findOne({ _id: id }, function (err, project) {
            if (err) {
                console.log('Error: Project not found.');
                reject(err);
            }
            else {
                resolve(project);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

exports.getAllProjects = function () {
    return new Promise((resolve, reject) => {
        Project.find({}, function (err, projects) {
            if (err) {
                reject(err);
                console.log('Error: Unable to resolve all projects.');
            }
            else {
                resolve(projects);
                console.log('Success: All projects resolved.');
            }
        });
    })
}

exports.updateProject = function(id, update) {
    return new Promise((resolve, reject) => {
        Project.findByIdAndUpdate(id, update, function (err, project) {
            if (err) {
                reject(err);
                console.log('Error: Failed to update project.');
            }
            else {
                //if update was to add student ID (I.E Student selects pre-defined project)
                if (update.studentID) {
                    //update discriminator keys
                    Student.findByIdAndUpdate(update.studentID, {project: project._id}, function (err, student) {
                        if (err) {
                            reject(err);
                        }
                    }); 
                    Staff.findByIdAndUpdate(project.supervisorID, { "$push": { "projects": project._id } }, function (err, supervisor) {
                        if (err) {
                            reject(err);
                        }
                    });
                }
                resolve(true);
                console.log('Success: Project status updated.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
};

exports.deleteProjects = function(projects) {
    for (let index = 0; index < projects.length; index++) {
        const projectID = projects[index];

        Project.findByIdAndDelete(projectID, function (err, doc) {
            if (err) {
                return false;
            }
            console.log(doc); 
        });        
    }
    return true;
}
