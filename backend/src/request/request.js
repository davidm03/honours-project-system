/* 
    David McDowall - Honours Project
    Request.js class for performing Request functionality
*/

// define Request, Staff models and project Data Access Layer
const Request = require('./request.model');
const projectDAL = require('../project/project');
const Staff = require('../user/staff.model');

/* Function for creating a new request 
    Params: request title, request description, request topic area, student object, supervisor object
*/
exports.createRequest = function (title, description, topic_area, student, supervisor) {
    return new Promise((resolve, reject) => {
        // create new Request object
        var newRequest = new Request({
            studentID: student._id,
            supervisorID: supervisor._id,
            date: new Date() / 1000,
            title,
            description,
            topic_area,
            status: 'Pending'
        });
        // save new request within DB
        newRequest.save(function (err) {
            // handle errors
            if (err) {
                reject(err);
            }
            else {
                //find supervisor and update discriminator request collection
                var updatedRequests = supervisor.supervision_requests;
                updatedRequests.push(newRequest._id);
                Staff.findByIdAndUpdate(supervisor._id, { supervision_requests: updatedRequests }, function (err, user) {
                    // handle errors
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

/* Function for finding a student's requests by ID
    Params: student ID
*/
exports.getStudentRequests = function (id) {
    return new Promise((resolve, reject) => {
        // Find requests where student ID matches
        Request.find({ studentID: id }, function (err, requests) {
            // handle errors
            if (err) {
                console.log('Error: Request not found.');
                reject(err);
            }
            else {
                // return requests
                resolve(requests);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

/* Function for finding a student's requests by ID
    Params: supervisor ID
*/
exports.getSupervisorRequests = function (id) {
    return new Promise((resolve, reject) => {
        // Find requests where supervisor ID matches
        Request.find({ supervisorID: id }, function (err, requests) {
            // handle errors
            if (err) {
                console.log('Error: Request not found.');
                reject(err);
            }
            else {
                // return requests
                resolve(requests);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

/* Function for updating a request by ID
    Params: Request ID and updated request
*/
exports.updateRequest = function (id, update) {
    return new Promise((resolve, reject) => {
        // Attempt to find request by Id and perform update
        Request.findByIdAndUpdate(id, update, function (err, request) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Failed to update request.');
            }
            else {
                // success response
                resolve(true);
                console.log('Success: Request status updated.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
};

/* Function for accepting a request by ID
    Params: request ID to be accepted
*/
exports.acceptRequest = function (id) {
    return new Promise((resolve, reject) => {
        // Atempt to find request by ID and update status to accepted
        Request.findByIdAndUpdate(id, { status: "Accepted" }, function (err, request) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Failed to accept request.');
            }
            else {
                // Request accepted - create a new project for the request
                console.log('Success: Request status accepted.');
                var addProject = projectDAL.addProject(request.title, request.description, request.topic_area, false, "", request.studentID, request.supervisorID);
                // return success/fail response for new project creation
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

/* Function for declining a request by ID
    Params: request ID to be declined
*/
exports.declineRequest = function (id) {
    return new Promise((resolve, reject) => {
        // Attempt to find request by ID and update status to declined
        Request.findByIdAndUpdate(id, { status: "Declined" }, function (err, request) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Failed to decline request.');
            }
            else {
                // success response
                console.log('Success: Request status declined.');
                resolve(true);
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
}

/* Function for deleting a request by ID
    Params: Request ID to be deleted
*/
exports.deleteRequest = function (id) {
    // find the request by ID and delete
    Request.findByIdAndDelete(id, function (err, doc) {
        // handle errors
        if (err) {
            throw (err);
        }
    });
};
