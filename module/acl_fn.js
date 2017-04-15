/**
 * Created by emalsha on 3/21/17.
 */

let acl = require('acl');
let debug =require('debug')('nyx:acl');

acl = new acl(new acl.memoryBackend());

// create roles and give permission
acl.allow('admin','administration','view');
acl.allow('user1',['/users/user','/users/myfile','/users/publicfile','/users/help'],['get','post']);

// add users to roles
acl.addUserRoles('Emalsha', 'user1');
acl.addUserRoles('Sulochana','admin');

module.exports.aclobj = acl;

module.exports.aclfnc = function(){
    return function(req,resp,next){
        let u = req.session.passport.user;
        debug('User '+ req.session.passport.user + ' verifying.');
        acl.isAllowed(u,'administrator', 'view',function (err, res) {
            resp.locals.isAdmin = res;
            next();
        });

    }
};




