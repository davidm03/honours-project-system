/* 
  David McDowall - Honours Project
  App.js file for initialising and running the Node.js/Express.js application acting as the server-side API
*/

var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('dotenv').config();

/* Define routers to handle specific requests */
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var projectRouter = require('./routes/project');
var requestRouter = require('./routes/requests');
var announcementRouter = require('./routes/announcement');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Open MongoDB database connection via Mongoose
   Connection string is stored within .env file. */
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
const connection = mongoose.connection;

// Print success message upon successful connection
connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})

app.use(cors());

/* Connect the URL routes with each Router */
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/project', projectRouter);
app.use('/requests', requestRouter);
app.use('/announcement', announcementRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
