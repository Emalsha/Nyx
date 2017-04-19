/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const debug = require('debug')('nyx:adminRouter');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../DBconfig/database');
const User = require('../model/memberManagement');

const Download = require('../model/Download');
// Permission granting
let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(2,(req,res)=>{return req.user.username});

router.get('/management',aclfn,aclf,function(req,res){
    res.render('userManagement',{title:'NYX | User Management',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});
/////////// User Registration
router.post('/register', (req, res , next) => {
	let newUser = new User({

		email : req.body.email,
		username : req.body.username,
		password : req.body.password
	});

	User.addUser(newUser, (err, user) => {
		if(err){
			res.json({success : false , msg :'Failed to connect Database'});
		} else{
			res.json({success : true , msg :'User is registered'});
		}
	});
});
////////////////////////////
router.get('/administration',aclfn,aclf,function(req,res){
    Download.find({state:'pending'},(err,downloads)=>{
        if(err){
            debug(err);
        }
        res.render('administrator',{title:'NYX | Administrator',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:downloads});

    });

});


module.exports = router;
