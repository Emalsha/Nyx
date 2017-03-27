var express = require('express');
var router = express.Router();
var database = require('../database/db');
var passport = require('passport');
var session = require('express-session');
var acl = require('../module/acl_fn');

/* GET users listing. */
router.get('/user',acl(),function(req, res, next) {
    res.render('user',{title:'NYX | USER'});
});

router.get('/myfile',acl(),function(req,res,next){
    res.render('myfile',{title:'NYX | My File'});
});

router.get('/publicfile',acl(),function(req,res,next){
    res.render('publicfile',{title:'NYX | Public File'});
});

router.get('/management',acl(),function(req,res,next){
    res.render('userManagement',{title:'NYX | User Management'});
});

router.get('/administration',acl(),function(req,res,next){
  res.render('administrator',{title:'NYX | Administrator'});
});

router.get('/help',acl(),function(req,res,next){
    res.render('help',{title:'NYX | Help'});
});

module.exports = router;
