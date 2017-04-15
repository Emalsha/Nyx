/**
 * Created by emalsha on 3/21/17.
 */

let acl = require('acl');
let debug =require('debug')('nyx:acl');

acl = new acl(new acl.memoryBackend());

// create roles and give permission
acl.allow('admin','administration','view');
acl.allow('user1','user','*');

// add users to roles
acl.addUserRoles('Emalsha', 'user1');
acl.addUserRoles('Sulochana','admin');

module.exports = acl;

// module.exports = function(){
//     return function(req,resp,next){
//         let u = req.session.passport.user;
//         debug('User '+ req.session.passport.user + ' verifying.');
//         acl.isAllowed(u,'administrator', 'view',function (err, res) {
//             resp.locals.isAdmin = res;
//
//             debug(req.url + ' ' + res);
//             if(req.url == '/administration' && !res){
//                 req.flash('error',"You not have permission!");
//                 // res.redirect('/users/user');
//                 next(()=>{
//                     res.render('user',{title:'NYX | USER',message:req.flash('success') || req.flash('error') ,user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
//                 })
//             }
//
//             next();
//         });
//
//     }
// };




