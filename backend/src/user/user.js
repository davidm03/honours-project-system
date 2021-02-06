const User = require('./user.model.js');
const Student = require('./student.model.js');
const Staff = require('./staff.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createJWT } = require('./auth.js');

exports.findUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, function (err, user) {
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

exports.authenticateUser = function (email, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            if (!user) {
                resolve({error: "email", message: "Email does not exist."});
            }
            else{
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        resolve({error: "password", message: "Incorrect password."});
                    }

                    let access_token = createJWT(
                        user.email,
                        user._id,
                        user.role,
                        "24h" //set as 24h for testing purposes
                    );
                    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                        if (err) {
                            resolve({error: "password", message: "Unable to authenticate access."});
                        }
                        if (decoded) {
                            resolve({success: true, token: access_token, message: user});
                        }
                    });
                });
                /* if (user.password==password) {
                    resolve(user);
                } */
            }            
        }).catch(function (err) {
            throw (err)
        });
    });
}

exports.registerUser = function (email, password, role) {
    return new Promise((resolve, reject) => {
        var newUser = new User({
            email,
            password,
            role
        });
        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            })
        })
    });
}

exports.registerStaff = function (email, first_name, surname, password, role, topic_area) {
    return new Promise((resolve, reject) => {
        var newUser = new Staff({
            email,
            first_name,
            surname,
            password,
            role,
            topic_area
        });
        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            })
        })
    });
}

exports.registerStudent = function (email, first_name, surname, password, role, studentID) {
    return new Promise((resolve, reject) => {
        var newUser = new Student({
            email,
            first_name,
            surname,
            password,
            role,
            studentID
        });
        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            })
        })
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

