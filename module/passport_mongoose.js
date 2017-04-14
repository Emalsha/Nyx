/**
 * Created by emalsha on 3/26/17.
 */

let passport = require('passport');
let LocalStrategy = require('passport-local');
let debug = require('debug')('nyx:passport');

let User = require('../model/User');

// Used to serialize the user
passport.serializeUser(User.serializeUser());

//Used to deserialize the user
passport.deserializeUser(User.deserializeUser());

// Use local strategy to signin and signup
passport.use('local-signin',new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},(req,username,password,done)=>{

    User.authenticate()(username,password,(err,user)=>{

        if(err){
            debug(err);
            return done(err);
        }

        if(!user){
            req.flash('error','Password or username are incorrect');
            return done(null,false);
        }else{
            return done(null,user);
        }

    });
}
));

