var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/user', function(req, res, next) {
  res.render('user',{title:'NYX | USER'});
});

router.get('/administration',function(req,res,next){
  res.render('administrator',{title:'NYX | Administrator'});
})

module.exports = router;
