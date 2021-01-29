const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    username: { type: String },
    password: { type: String },
    supervision_requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }]
});

module.exports = mongoose.model('User', User);