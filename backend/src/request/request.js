const Request = require('./request.model');

exports.createRequest = function (title, description, student, supervisor) {
    return new Promise((resolve, reject) => {
        var newRequest = new Request({
            studentID: student._id,
            supervisorID: supervisor._id,
            date: new Date() / 1000,
            title,
            description,
            status: 'Pending'
        });
        newRequest.save(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
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

exports.deleteRequest = function(id) {
    Request.findByIdAndDelete(id, function (err, doc) {
        if (err) {
            throw (err);
        }
    });
};
