const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var options = { discriminatorKey: 'userType' };

let User = new Schema({
    email: { type: String, unique: true, required: true },
    first_name: { type: String },
    surname: { type: String },
    password: { type: String, required: true },
    role: { type: Array },
    last_login: { type: Date }
    //project: { type: Schema.Types.ObjectId, ref: 'Project'},
    //supervision_requests: [{ type: Schema.Types.ObjectId, ref: 'Request' }]
}, options);

module.exports = mongoose.model('User', User);