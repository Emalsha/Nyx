const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');


let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(1,(req,res)=>{return req.user.username});

/* GET users listing. */
router.get('/dashboard',aclfn,aclf,function(req, res) {
    res.render('dashboard',{title:'NYX | Dashboard',message:req.flash('success'),user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/myfile',aclfn,aclf,function(req,res){
    res.render('myfile',{title:'NYX | My File',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/publicfile',aclfn,aclf,function(req,res){
    res.render('publicfile',{title:'NYX | Public File',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/help',aclfn,aclf,function(req,res){
    res.render('help',{title:'NYX | Help',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

module.exports = router;
