let express = require('express');
let router = express.Router();
let passport = require('passport');
let debug = require('debug')('nyx:route');
const acl = require('../module/acl_fn').aclobj;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'NYX',message:req.flash('error') });
});


let User = require('../model/User');

router.post('/register', function(req, res,done) {

    let newUser = new User({
        fname:'Emalsha',
        lname:'Rasad',
        username:req.body.username,
        registrationNumber:14020645,
        indexNumber:14020645,
        role:'user',
        created_at:new Date('2017-02-24'),
        updated_at:new Date('2017-05-14')
    });

    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash('error',"Error on registration. "+ err) ;
            res.redirect('/');
        }

        debug('New user registering.');
        passport.authenticate('local-signin')(req,res,function(){
            acl.addUserRoles(req.user.username,req.user.role);
            req.flash('success',"You are successfully registered") ;
            res.redirect('/users/dashboard');

        })

    })
});


// Send login request throug passport midleware and redirect policy
router.post('/login',passport.authenticate('local-signin',{
    successRedirect:'/users/dashboard',
    failureRedirect:'/'
})
);


router.get('/logout',function (req, res) {
    let name = req.user.username;
    debug('Logout '+req.user.username);
    req.logout();
    req.flash('error',"You have been logged out.");
    res.redirect('/');
});


module.exports = router;
