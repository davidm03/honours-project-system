/* 
    David McDowall - Honours Project
    Request.model.js Model class for Request object
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define Request schema
let Request = new Schema({
    studentID: { type: Schema.Types.ObjectId, ref: 'User' },    // user id of student
    supervisorID: { type: Schema.Types.ObjectId, ref: 'User' }, // user id of supervisor
    date: { type: Number }, // date in number format
    title: { type: String },    // request title
    description: { type: String },  // request description
    topic_area: { type: String },   // request topic area
    status: { type: String }    // request status
});

module.exports = mongoose.model('Request', Request);