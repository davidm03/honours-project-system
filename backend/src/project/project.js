const Project = require('./project.model');

exports.addProject = function (title, description, topic_area, available, status, studentID, supervisorID) {
    return new Promise((resolve, reject) => {
        var newProject = new Project({
            title: title,
            description: description,
            topic_area: topic_area,
            available: available,
            status: status,
            studentID: studentID,
            supervisorID
        });
        newProject.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
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
    //var update = { status: newStatus };

    return new Promise((resolve, reject) => {
        Project.findByIdAndUpdate(id, update, function (err, project) {
            if (err) {
                reject(err);
                console.log('Error: Failed to update project.');
            }
            else {
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
        });        
    }
    return true;
}
