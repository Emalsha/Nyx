var express = require('express');
var router = express.Router();
var database = require('../database/db');
var passport = require('passport');
var session = require('express-session');
var acl = require('../module/acl_fn');

var isAdmin =true;

/* GET users listing. */
router.get('/user',acl(),function(req, res, next) {
    res.render('user',{title:'NYX | USER'});
});

router.get('/myfile',function(req,res,next){
    res.render('myfile',{title:'NYX | My File',isAdmin:isAdmin});
});

router.get('/publicfile',function(req,res,next){
    res.render('publicfile',{title:'NYX | Public File',isAdmin:isAdmin});
});

router.get('/administration',function(req,res,next){
  res.render('administrator',{title:'NYX | Administrator',isAdmin:isAdmin});
});

router.get('/help',function(req,res,next){
    res.render('help',{title:'NYX | Help',isAdmin:isAdmin});
});

router.get('/student',function (req,res,next) {

  database.get().collection('students').find().toArray(function(err,result){
        if(err){
            return console.log(err);
        }

        res.render('sample',{students:result});
    });
});

module.exports = router;
