const User = require('./user.model.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Student = new Schema({
    studentID: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
});

module.exports = User.discriminator('Student', Student);