/* 
    David McDowall - Honours Project
    Users.js class for performing functionality for Users
*/

// define user, student and staff models
const User = require('./user.model.js');
const Student = require('./student.model.js');
const Staff = require('./staff.model.js');
// define bcrypt, jwt libaries
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createJWT } = require('./auth.js');

/* Function for finding users by email address
    Params: user email address
*/
exports.findUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        // Find user with matching email address
        User.findOne({ email: email }, function (err, user) {
            // handle errors
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            // return user
            resolve(user);
        }).catch(function (err) {
            throw (err)
        });
    });
}

/* Function for finding user by ID
    Params: user id
*/
exports.findUserById = function (id) {
    return new Promise((resolve, reject) => {
        // find user with matching id
        User.findOne({ _id: id }, function (err, user) {
            // handle errors
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            // return user
            resolve(user);
        }).catch(function (err) {
            throw (err)
        });
    });
}

/* Function for getting a student by university student ID 
    Params: student ID
*/
exports.getStudentByStudentId = function (id) {
    return new Promise((resolve, reject) => {
        // find student where student ID matches
        User.findOne({ userType: "Student", studentID: id }, function (err, user) {
            // handle errors
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            // return user
            resolve(user);
        }).catch(function (err) {
            throw (err)
        });
    });
}

/* Function for getting all users */
exports.getAllUsers = function () {
    return new Promise((resolve, reject) => {
        // find all users from the DB
        User.find({}, function (err, users) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Unable to resolve all users.');
            }
            else {
                // define array to hold users
                var outputUsers = [];
                // loop through users and remove password attribute
                var len = users.length, i = 0;
                while (i < len) {
                    const user = users[i];
                    user.password = undefined;
                    outputUsers.push(user);
                    i++;
                }
                // return users without passwords
                resolve(outputUsers);
                console.log('Success: All users resolved.');
            }
        });
    })
}

/* Function for getting all supervisors */
exports.getSupervisors = function () {
    return new Promise((resolve, reject) => {
        // get all users from DB
        User.find({}, function (err, users) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Unable to resolve all supervisors.');
            }
            else {
                // create array to hold supervisors
                var supervisors = [];
                // loop through users and extract supervisor users
                for (let index = 0; index < users.length; index++) {
                    const user = users[index];
                    user.password = undefined;
                    if (user.role.includes("SUPERVISOR")) {
                        supervisors.push(user);
                    }
                }
                // return supervisors
                resolve(supervisors);
                console.log('Success: All supervisors resolved.');
            }
        });
    })
}

/* Function for getting all students */
exports.getStudents = function () {
    return new Promise((resolve, reject) => {
        // get all users from DB
        User.find({}, function (err, users) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Unable to resolve all students.');
            }
            else {
                // create array to hold students
                var students = [];
                // loop through users and extract students
                for (let index = 0; index < users.length; index++) {
                    const user = users[index];
                    user.password = undefined;
                    if (user.role.includes("STUDENT")) {
                        students.push(user);
                    }
                }
                // return students
                resolve(students);
                console.log('Success: All students resolved.');
            }
        });
    })
}

/* Function for authenticating a user login
    Params: user email and password
*/
exports.authenticateUser = function (email, password) {
    return new Promise((resolve, reject) => {
        // find user from DB with matching email (case insensitive)
        User.findOne({ email: new RegExp(`^${email}$`, 'i') }, function (err, user) {
            // handle errors
            if (err) {
                console.log('An error has been encounted');
                reject(err);
            }
            // handle no user found error
            if (!user) {
                resolve({ error: "email", message: "Email does not exist." });
            }
            else {
                // use bcrypt to check if password matches encrypted password
                bcrypt.compare(password, user.password).then(isMatch => {
                    // handle incorrect password error
                    if (!isMatch) {
                        resolve({ error: "password", message: "Incorrect password." });
                    }

                    // if successful login - create a new JWT (rolling update)
                    let access_token = createJWT(
                        user.email,
                        user._id,
                        user.role,
                        "15m"
                    );
                    // verify the JWT with the secret key
                    jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
                        // handle errors
                        if (err) {
                            resolve({ error: "password", message: "Unable to authenticate access." });
                        }
                        // if verified 
                        if (decoded) {
                            // update the last login of the user to current date
                            User.findByIdAndUpdate(user._id, { last_login: new Date() / 1000 }, function (err, updatedUser) {
                                // handle errors
                                if (err) {
                                    reject(err);
                                }
                                // success - return token and user
                                resolve({ success: true, token: access_token, message: updatedUser });
                            })

                        }
                    });
                });
            }
        }).catch(function (err) {
            throw (err)
        });
    });
}

/* Function for registering a new user
    Params: user email, password and role
*/
exports.registerUser = function (email, password, role) {
    return new Promise((resolve, reject) => {
        // create new user object
        var newUser = new User({
            email,
            password,
            role
        });
        // use bcrypt to salt and hash user password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                // handle error
                if (err) throw err;
                // store the hashed password
                newUser.password = hash;
                // save user in DB
                newUser.save(function (err) {
                    // handle errors
                    if (err) {
                        reject(err);
                    }
                    // return success
                    else {
                        resolve(true);
                    }
                });
            })
        })
    });
}

/* Function for registering a new staff member
    Params: email, first name, surname, password, role, topic area
*/
exports.registerStaff = function (email, first_name, surname, password, role, topic_area) {
    return new Promise((resolve, reject) => {
        // create new staff object
        var newUser = new Staff({
            email,
            first_name,
            surname,
            password,
            role,
            topic_area
        });
        // use bcrypt to salt and hash password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                // handle error
                if (err) throw err;
                // store the hashed password
                newUser.password = hash;
                // save user within DB
                newUser.save(function (err) {
                    // handle errors
                    if (err) {
                        reject(err);
                    }
                    else {
                        // return success
                        resolve(true);
                    }
                });
            })
        })
    });
}

/* Register a new student account
    Params: email, first name, surname, password, role and student ID
*/
exports.registerStudent = function (email, first_name, surname, password, role, studentID) {
    return new Promise((resolve, reject) => {
        // create a new user object
        var newUser = new Student({
            email,
            first_name,
            surname,
            password,
            role,
            studentID
        });
        // use bcrypt to salt and hash user password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                // handle error
                if (err) throw err;
                // store hashed password
                newUser.password = hash;
                // save user within DB
                newUser.save(function (err) {
                    // handle errors
                    if (err) {
                        reject(err);
                    }
                    else {
                        // return success
                        resolve(true);
                    }
                });
            })
        })
    });
}

/* Function for updating a user account
    Params: user id and updated user
*/
exports.updateUser = function (id, update) {
    return new Promise((resolve, reject) => {
        // attempt to find user by ID and perform update
        User.findByIdAndUpdate(id, update, function (err, user) {
            // handle errors
            if (err) {
                reject(err);
                console.log('Error: Failed to update user.');
            }
            // return success
            else {
                resolve(true);
                console.log('Success: User status updated.');
            }
        }).catch(function (err) {
            console.error(err);
        });
    });
}

/* Function for deleting users 
    Params: collection of users to be deleted
*/
exports.deleteUsers = function (users) {
    // loop through users for deletion
    for (let index = 0; index < users.length; index++) {
        // get current user id
        const userID = users[index];

        // find user by id and delete user
        User.findByIdAndDelete(userID, function (err, doc) {
            // handle errors
            if (err) {
                return false;
            }
        });
    }
    // success return
    return true;
}

