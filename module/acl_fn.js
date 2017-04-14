/**
 * Created by emalsha on 3/21/17.
 */

let acl = require('acl');
let debug =require('debug')('nyx:acl');

acl = new acl(new acl.memoryBackend());

// create roles and give permission
acl.allow('admin','administrator','view');

// add users to roles
acl.addUserRoles('Emalsha', 'guest');
acl.addUserRoles('Sulochana','admin');

module.exports = function(){
    return function(req,resp,next){
        let u = req.session.passport.user;
        debug('User '+ req.session.passport.user + ' logged in...');
        let is = acl.isAllowed(u,'administrator', 'view',function (err, res) {
            resp.locals.isAdmin = res;
            next();
        });

    }
};




