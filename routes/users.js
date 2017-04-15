const express = require('express');
const router = express.Router();
const database = require('../database/db');
const passport = require('passport');
const session = require('express-session');
const acl = require('../module/acl_fn');
let aclo = acl.aclobj;
let aclf = acl.aclfnc();
let aclfn = aclo.middleware(2,(req,res)=>{return req.user.username});

/* GET users listing. */
router.get('/user',aclfn,aclf,function(req, res) {
    res.render('user',{title:'NYX | USER',message:req.flash('success'),user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/myfile',aclfn,aclf,function(req,res){
    res.render('myfile',{title:'NYX | My File',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/publicfile',aclfn,aclf,function(req,res){
    res.render('publicfile',{title:'NYX | Public File',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/management',aclfn,aclf,function(req,res){
    res.render('userManagement',{title:'NYX | User Management',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/administration',aclfn,aclf,function(req,res){
  res.render('administrator',{title:'NYX | Administrator',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/help',aclfn,aclf,function(req,res){
    res.render('help',{title:'NYX | Help',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

module.exports = router;
