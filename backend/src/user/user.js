const User = require('./user.model');

exports.findUserByUsername = function (username) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            resolve(user);
        }).catch(function (err) {
            throw (err)
        });
    });
}

exports.getAllUsers = function () {
    return new Promise((resolve, reject) => {
        User.find({}, function (err, users) {
            if (err) {
                reject(err);
                console.log('Error: Unable to resolve all users.');
            }
            else {
                resolve(users);
                console.log('Success: All users resolved.');
            }
        });
    })
}

exports.authenticateUser = function (username, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            if (!user) {
                resolve({error: "username", message: "Username does not exist."});
            }
            else{
                if (user.password==password) {
                    resolve(user);
                }
                else{
                    resolve({error: "password", message: "Incorrect password."});
                }
            }            
        }).catch(function (err) {
            throw (err)
        });
    });
}

exports.registerUser = function (username, password) {
    return new Promise((resolve, reject) => {
        var newUser = new User({
            username,
            password   
        });
        newUser.save(function (err) {
            if (err) {
                return err;
            }
            else {
                resolve(true);
            }
        });
    });
}

exports.addUser = function (username, password) {
    return new Promise((resolve, reject) => {
        var newUser = new User({
            username,
            password   
        });
        newUser.save(function (err) {
            if (err) {
                return err;
            }
            else {
                resolve(true);
            }
        });
    });
}

exports.updateUser = function(id, update) {
    //var update = { status: newStatus };

    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, update, function (err, user) {
            if (err) {
                reject(err);
                console.log('Error: Failed to update user.');
            }
            else {
                resolve(true);
                console.log('Success: User status updated.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
}

exports.deleteUser = function(id) {
    User.findByIdAndDelete(id, function (err, doc) {
        if (err) {
            throw (err);
        }
    });
}

