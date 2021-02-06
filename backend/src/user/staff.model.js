const User = require('./user.model.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Staff = new Schema({
    topic_area: { type: String },
    supervision_requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
});

module.exports = User.discriminator('Staff', Staff);

