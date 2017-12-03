var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// post express additions //
const mongoose = require('mongoose');
// Slashes syntax //
var slashes = require('slashes'); // dont need here
var urlencode = require('urlencode'); // dont need here
// urlencode(unCodedString)
// urlencode.decode(codedString)

// slashes.add(string, [number])
// slashes.strip(string, [number])
const validator = require('validator'); // dont need here
// See this link
// https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
// 
// https://www.npmjs.com/package/validator

var creds = require('./creds');
// console.log(creds.connectionString);
mongoose.connect(creds.connectionString);


// End additions //

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// make other route files available
app.use("/users", users);
app.use("/", index);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


// app.listen(port, () => {
// 	"DayTripper: Listening on port " + port
// })

