var express = require('express');
var path = require('path');
var logger = require('morgan');

// Route configs
var aria2req = require('./aria2app/aria2routes/index');

var aria2app = express();

// Routers
aria2app.use('/aria2app', aria2req);

aria2app.use(function (req, res, next) {
    console.log('aria 2 server runnin...');
});

// catch 404 and forward to error handler
aria2app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
aria2app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.aria2app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = aria2app;
