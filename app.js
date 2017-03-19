var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local');
var passport_fn = require('./module/passport_fn');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'project-nyx',saveUninitialized: true,resave:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/bower_components',express.static(path.join(__dirname, 'bower_components')));
app.use('/public',express.static(path.join(__dirname, 'public')));

// Use local strategy to signin and signup
passport.use('local-signin',new localStrategy({passReqToCallback:true},function(req,username,password,done){
    passport_fn.localAuth(username,password)
        .then(function (user) {
            if(user){
                console.log('Logged in as :'+user.username);
                req.session.success = "You are successfully logged in as "+user.username;
                done(null,user);
            }else{
                console.log('Could not logged in');
                req.session.error = 'Could not logged in. Please try again later.';
                done(null,user);
            }
        })
        .fail(function (err) {
            console.log(err.body);
        });
}));

passport.use('local-signup',new localStrategy({passReqToCallback:true},function (req, username, password, done) {
    passport_fn.localReg(username,password)
        .then(function(user){
            if(user){
                console.log('New user registered : '+user.username);
                req.session.success = "You are successfully registered";
                done(null,user);
            }
            if(!user){
                console.log('Could not registered.');
                req.session.error = "That username already use in. Please try again another one.";
                done(null,user);
            }
        })
        .fail(function (err) {
            console.log(err.body);
        })
}));


app.use('/', index);

// Authentication middleware
app.use(function (req, res, next) {
    if(req.isAuthenticated()){return next();}
    req.session.error = " Please sign in !";
    res.redirect('/')
});

app.use('/users', users);

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
