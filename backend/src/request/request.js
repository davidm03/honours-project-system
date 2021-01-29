const Request = require('./request.model');

exports.createRequest = function (student, supervisor, idea, description) {
    return new Promise((resolve, reject) => {
        var newRequest = new Request({
            studentID: student.id_,
            supervisorID: supervisor.id_,
            date: new Date(),
            project_idea: idea,
            description: description,
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

exports.getRequest = function (id) {
    return new Promise((resolve, reject) => {
        Request.findOne({ _id: id }, function (err, request) {
            if (err) {
                console.log('Error: Request not found.');
                reject(err);
            }
            else {
                resolve(request);
            }
        }).catch(function (err) {
            throw (err)
        });
    });
};

exports.updateRequest = function(id, update) {
    //var update = { status: newStatus };
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
