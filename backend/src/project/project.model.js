const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Project = new Schema({
    studentID: { type: Schema.Types.ObjectId, reF: 'User' },
    title: { type: String },
    description: { type: String },
    topic_area: { type: String },
    available: { type: Boolean },
    status: { type: String },
    activity: [{ action: String, activity: String }],
    supervisorID: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', Project);