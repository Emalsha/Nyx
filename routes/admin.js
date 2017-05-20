/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const debug = require('debug')('nyx:adminRouter');
const Download = require('../model/Download');
let passport = require('passport');


// Permission granting
let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(2,(req,res)=>{return req.user.username});

router.get('/management',aclfn,aclf,function(req,res){
    res.render('userManagement',{title:'NYX | User Management',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});


router.get('/administration',aclfn,aclf,function(req,res){
    Download.find({state:'pending'},(err,downloads)=>{
        if(err){
            debug(err);
        }
        res.render('administrator',{title:'NYX | Administrator',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:downloads});

    });

});
router.get('/viewfiles',aclfn,aclf,function(req,res){
    Download.find({state:'pending'},(err,downloads)=>{
        if(err){
            debug(err);
        }
        res.render('viewfiles',{title:'NYX | Administrator',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:downloads});

    });

});
//// for indivudual member registration
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
            req.flash('successMessage',"New account is successfully registered") ;
            res.redirect('/users/dashboard');

        })

    })
});

///// End of individual member registration


module.exports = router;
