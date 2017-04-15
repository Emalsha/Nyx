/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const debug = require('debug')('nyx:adminRouter');

const Download = require('../model/Download');
// Permission granting
let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(2,(req,res)=>{return req.user.username});

router.get('/management',aclfn,aclf,function(req,res){
    res.render('userManagement',{title:'NYX | User Management',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname}});
});

router.get('/administration',aclfn,aclf,function(req,res){
    Download.find({},(err,downloads)=>{
        if(err){
            debug(err);
        }
        debug(downloads);
        res.render('administrator',{title:'NYX | Administrator',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:downloads});

    });

});


module.exports = router;
