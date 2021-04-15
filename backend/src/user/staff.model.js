/* 
    David McDowall - Honours Project
    Staff.model.js Model class for Staff users (Supervisors and Module Leaders)
*/

// define User model
const User = require('./user.model.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Staff schema
let Staff = new Schema({
    topic_area: { type: String },   // staff member topic area 
    supervision_requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }],    // collection of supervision requests 
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }] // collection of projects supervising
});

// export as discriminator of User object (subclass of User)
module.exports = User.discriminator('Staff', Staff);

