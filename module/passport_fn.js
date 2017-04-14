// /**
//  * Created by emalsha on 3/18/17.
//  */
//
// var passport = require('passport');
// var localStrategy = require('passport-local');
// var bcrypt = require('bcryptjs');
// var database = require('../database/db');
// var Q = require('q');
//
// // Register new user
// var localReg = function (username, password) {
//
//     var defer = Q.defer();
//
//     database.get().collection('user').findOne({'username':username})
//         .then(function (result) {
//             if(null != null){
//                 defer.resolve(false);
//             }else{
//                 const saltRound = 10;
//                 bcrypt.hash(password,saltRound,function (err, hash) {
//                     var newUser = {
//                         'username':username,
//                         'password':hash
//                     };
//                     database.get().collection('user').save(newUser,function (err, result) {
//                         if(err){
//                             defer.resolve(false);
//                         }else{
//                             defer.resolve(newUser);
//                         }
//                     });
//                 });
//             }
//         });
//     return defer.promise;
// };
//
// // Check user credentials
// var localAuth = function (username, password) {
//     var defer = Q.defer();
//     database.get().collection('user').findOne({'username':username})
//         .then(function (result) {
//             if (null == result){
//                 defer.resolve(false);
//             }else{
//                 var hash = result.password;
//                 bcrypt.compare(password,hash,function (err, res) {
//                     if(res){
//                         defer.resolve(result);
//                     }else{
//                         defer.resolve(false);
//                     }
//                 });
//             }
//         });
//     return defer.promise;
// };
//
// // Used to serialize the user
//
// passport.serializeUser(function (user, done) {
//     var uid = { '_id': user._id,'username': user.username};
//     done(null,uid);
// });
//
// //Used to deserialize the user
// passport.deserializeUser(function(uid,done){
//     done(null,uid);
// });
//
// // Use local strategy to signin and signup
// passport.use('local-signin',new localStrategy({passReqToCallback:true},function(req,username,password,done){
//     localAuth(username,password)
//         .then(function (user) {
//             if(user){
//                 req.flash('success',"You are successfully logged in as "+user.username) ;
//                 done(null,user);
//             }else{
//                 req.flash('error','Could not logged in. Please try again later.');
//                 done(null,user);
//             }
//         })
//         .fail(function (err) {
//             console.log(err.body);
//         });
// }));
//
// passport.use('local-signup',new localStrategy({passReqToCallback:true},function (req, username, password, done) {
//     localReg(username,password)
//         .then(function(user){
//             if(user){
//                 req.flash('success',"You are successfully registered");
//                 done(null,user);
//             }
//             if(!user){
//                 req.flash('error',"That username already use in. Please try again another one.");
//                 done(null,user);
//             }
//         })
//         .fail(function (err) {
//             console.log(err.body);
//         })
// }));
