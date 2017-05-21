/**
 * Created by emalsha on 3/21/17.
 */

let acl = require('acl');
let debug =require('debug')('nyx:acl');

acl = new acl(new acl.memoryBackend());

// create roles and give permission
acl.allow('admin',['/admin/administration','/admin/viewfiles','/view_f/viewfiles','/view_f/view_publicfiles','/admin/management','/users','/admin/server','/admin/server_time','/admin/delete','/admin/managepublicfiles'],['get','post','view']);
acl.allow('user','/users',['get','post']);

// acl.allow('user',['/users/user','/users/myfile','/users/publicfile','/users/help'],['get','post']);

// add users to roles
acl.addUserRoles('Emalsha', 'user');
acl.addUserRoles('Sulochana','admin');
acl.addUserRoles('nyxsys','admin');

module.exports.aclobj = acl;

module.exports.aclfnc = function(){
    return function(req,resp,next){
        let u = req.session.passport.user;
        debug('User '+ req.session.passport.user + ' verifying.');
        acl.isAllowed(u,'/admin/administration', 'view',function (err, resa) {
            resp.locals.isAdmin = resa;
            acl.isAllowed(u,'/admin/management','view',function(err,resm){
               resp.locals.isManage = resm;
               next();
            });
        });

    }
};
