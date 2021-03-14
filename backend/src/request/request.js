const Request = require('./request.model');
const projectDAL = require('../project/project');
const Staff = require('../user/staff.model');

exports.createRequest = function (title, description, topic_area, student, supervisor) {
    return new Promise((resolve, reject) => {
        var newRequest = new Request({
            studentID: student._id,
            supervisorID: supervisor._id,
            date: new Date() / 1000,
            title,
            description,
            topic_area,
            status: 'Pending'
        });
        newRequest.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                //find supervisor and update discriminator request collection
                var updatedRequests = supervisor.supervision_requests;
                updatedRequests.push(newRequest._id); 
                Staff.findByIdAndUpdate(supervisor._id, {supervision_requests: updatedRequests}, function (err, user) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                }).catch(function (err) {
                    console.error(err);
                });                
            }
        });
    });
}

exports.getStudentRequests = function (id) {
    return new Promise((resolve, reject) => {
        Request.find({ studentID: id }, function (err, requests) {
            if (err) {
                console.log('Error: Request not found.');
                reject(err);
            }
            else {
                resolve(requests);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

exports.getSupervisorRequests = function (id) {
    return new Promise((resolve, reject) => {
        Request.find({ supervisorID: id }, function (err, requests) {
            if (err) {
                console.log('Error: Request not found.');
                reject(err);
            }
            else {
                resolve(requests);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

exports.updateRequest = function(id, update) {
    return new Promise((resolve, reject) => {
        Request.findByIdAndUpdate(id, update, function (err, request) {
            if (err) {
                reject(err);
                console.log('Error: Failed to update request.');
            }
            else {
                resolve(true);
                console.log('Success: Request status updated.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
};

exports.acceptRequest = function(id) {
    return new Promise((resolve, reject) => {
        Request.findByIdAndUpdate(id, { status: "Accepted" }, function (err, request) {
            if (err) {
                reject(err);
                console.log('Error: Failed to accept request.');
            }
            else {
                console.log('Success: Request status accepted.');
                var addProject = projectDAL.addProject(request.title, request.description, request.topic_area, false, "", request.studentID, request.supervisorID);
                if (addProject) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
}

exports.declineRequest = function(id) {
    return new Promise((resolve, reject) => {
        Request.findByIdAndUpdate(id, { status: "Declined" }, function (err, request) {
            if (err) {
                reject(err);
                console.log('Error: Failed to decline request.');
            }
            else {
                console.log('Success: Request status declined.');
                resolve(true);
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
}

exports.deleteRequest = function(id) {
    Request.findByIdAndDelete(id, function (err, doc) {
        if (err) {
            throw (err);
        }
    });
};
