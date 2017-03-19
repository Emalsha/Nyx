var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'NYX' });
});

// Register new users
router.post('/local-reg',passport.authenticate('local-signup',{
    successRedirect:'/users/user',
    failureRedirect:'/'
})
);

// Send login request throug passport midleware and redirect policy
router.post('/login',passport.authenticate('local-signin',{
  successRedirect:'/users/user',
    failureRedirect:'/'
})
);

router.post('/logout',function (req, res) {
    var name = req.user.username;
    console.log('Loggin out '+req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have been logged out.";

});


module.exports = router;
