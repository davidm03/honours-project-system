/* 
    David McDowall - Honours Project
    Project.model.js Model class for the Project object
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Project schema
let Project = new Schema({
    studentID: { type: Schema.Types.ObjectId, reF: 'User' },    // User ID of student undertaking project
    title: { type: String },    // project title
    description: { type: String },  // project description
    topic_area: { type: String },   // project topic area
    available: { type: Boolean },   // project availability
    status: { type: String },   // project status
    activity: [{ action: String, activity: String }],   // JSON collection of activity
    supervisorID: { type: Schema.Types.ObjectId, ref: 'User' }  // User ID of supervisor supervising project
});

module.exports = mongoose.model('Project', Project);