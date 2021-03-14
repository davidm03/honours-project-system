const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Announcement = new Schema({
    module_leaderID: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Number },
    message_body: { type: String }
});

module.exports = mongoose.model('Announcement', Announcement);