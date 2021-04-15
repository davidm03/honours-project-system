/* 
    David McDowall - Honours Project
    Announcement.model.js Model class for the Announcement object
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema for an announcement object
let Announcement = new Schema({
    module_leaderID: { type: Schema.Types.ObjectId, ref: 'User' },  // User ID of module leader
    date: { type: Number }, // date number
    message_body: { type: String }  // announcement message
});

module.exports = mongoose.model('Announcement', Announcement);