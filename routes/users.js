var express = require('express');
var router = express.Router();
var database = require('../database/db');

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.render('user',{title:'NYX | USER'});
});

router.get('/administration',function(req,res,next){
  res.render('administrator',{title:'NYX | Administrator'});
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
