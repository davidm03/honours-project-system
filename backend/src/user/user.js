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

