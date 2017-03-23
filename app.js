var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var passport_fn = require('./module/passport_fn');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);


// Route configs
var index = require('./routes/index');
var users = require('./routes/users');
var info = require('./routes/info');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configs
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({secret:'project-nyx',saveUninitialized: true,resave:true}));
// Due to cluster store sesion data on mongo db
app.use(session({
    secret:'project-nyx',
    saveUninitialized: true,
    resave:true,
    store:new MongoStore({url:"mongodb://localhost:27017/project_nyx"}),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/bower_components',express.static(path.join(__dirname, 'bower_components')));
app.use('/public',express.static(path.join(__dirname, 'public')));

// Routers
app.use('/', index);
// Authentication middleware
app.use(function (req, res, next) {
    if(req.isAuthenticated()){return next();}
    req.flash('error'," Please sign-in !");
    res.redirect('/')
});

app.use(function(req,res,next){
   app.locals.currentUser = {
       'uname':req.session.passport.user.username,
       'role' :req.session.passport.user._id,
   };
   next();
});

app.use('/users', users);
app.use('/info',info);

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
