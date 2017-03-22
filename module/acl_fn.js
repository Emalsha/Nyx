/**
 * Created by emalsha on 3/21/17.
 */

var acl = require('acl');

acl = new acl(new acl.memoryBackend());

// create roles and give permission
acl.allow('admin','administrator','view');

// add users to roles
acl.addUserRoles('Emalsha', 'guest');
acl.addUserRoles('Sulochana','admin');

module.exports = function(){
    return function(req,resp,next){
        var u = req.session.passport.user.username;
        console.log(req.session.passport.user);
        var is = acl.isAllowed(u,'administrator', 'view',function (err, res) {
            resp.locals.isAdmin = res;
            next();
        });

    }
};




