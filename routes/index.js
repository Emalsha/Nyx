let express = require('express');
let router = express.Router();
let passport = require('passport');
let debug = require('debug')('nyx:route');
const acl = require('../module/acl_fn').aclobj;

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/users/dashboard');
    }else{
        res.clearCookie("id_token");
        res.render('login', { title: 'NYX',message:req.flash('error') });
    }
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
router.post('/login',passport.authenticate('local-signin', { failureRedirect: '/' }),
    function(req, res) {
        var crypto = require("crypto");
        var id = crypto.randomBytes(8).toString('hex');
        req.flash('token',id);
        res.cookie('id_token' ,id);
        global.activesessions[id]= req.user.username;


        if (global.loggedinusers[req.user.username] === undefined){
            // SYNTAX : username : [[activesessions],role,lastlogin,[connectedsocketes]]
            global.loggedinusers[req.user.username] = [[],req.user.role,"",[]];
        }
        global.loggedinusers[req.user.username][0].push(id);
        global.loggedinusers[req.user.username][1] = req.user.role;
        global.loggedinusers[req.user.username][2] = new Date().getTime();


        res.redirect(302, '/users/dashboard');
    });



// router.post('/login',passport.authenticate('local-signin',{
//     successRedirect:'/users/dashboard',
//     failureRedirect:'/'
// })
// );
//
//


router.get('/logout',function (req, res) {
    debug('Logout '+req.user.username);
    if (global.loggedinusers[req.user.username] !== undefined){
        if (global.loggedinusers[req.user.username][0].indexOf(req.cookies['id_token']) !== -1){
            global.loggedinusers[req.user.username][0].splice(global.loggedinusers[req.user.username][0].indexOf(req.cookies['id_token']),1);
        }
        if (global.loggedinusers[req.user.username][0].length < 1 && global.loggedinusers[req.user.username][3].length === 0){
            delete global.loggedinusers[req.user.username];
        }
    }

    if (global.activesessions[req.cookies['id_token']] !== undefined){
        delete global.activesessions[req.cookies['id_token']];
    }
    // console.log(req.cookies['id_token']);
    res.clearCookie("id_token");
    req.logout();
    req.flash('error',"You have been logged out.");
    res.redirect('/');
});


module.exports = router;
