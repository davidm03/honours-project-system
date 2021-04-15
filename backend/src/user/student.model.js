/* 
    David McDowall - Honours Project
    Student.model.js Model class for student users
*/

// define user model
const User = require('./user.model.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define student schema
let Student = new Schema({
    studentID: { type: String, required: true },    // student ID
    project: { type: Schema.Types.ObjectId, ref: 'Project' } // student selected project
});

// export as discriminator of user (subclass of User)
module.exports = User.discriminator('Student', Student);