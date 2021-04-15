/* 
    David McDowall - Honours Project
    User.model.js Model class for User object
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define discriminator key for the different types of user available (Student/Staff)
var options = { discriminatorKey: 'userType' };

// define user schema
let User = new Schema({
    email: { type: String, unique: true, required: true },  // email address
    first_name: { type: String },   // first name
    surname: { type: String },  // surname
    password: { type: String, required: true }, // password hash
    role: { type: Array },  // user role (array)
    last_login: { type: Number }    // last login date as number 
}, options);    // user type

module.exports = mongoose.model('User', User);