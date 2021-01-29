const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Request = new Schema({
    studentID: { type: Schema.Types.ObjectId, ref: 'User' },
    supervisorID: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    project_idea: { type: String },
    description: { type: String },
    status: { type: String }
});

module.exports = mongoose.model('Request', Request);