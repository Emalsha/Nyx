/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const debug = require('debug')('nyx:adminRouter');
const Download = require('../model/Download');
const files = require('../model/Files');
let passport = require('passport');


// Permission granting
let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(2,(req,res)=>{return req.user.username});



router.get('/administration',aclfn,aclf,function(req,res){

    Download.find({state:'pending'},(err,downloads)=>{
        if(err){
            debug(err);
        }
        res.render('administrator',{title:'NYX | Administrator',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:downloads});

    });

});

router.get('/viewfiles',aclfn,aclf,function(req,res){
    files.find({availability: 'private'} && {request_user: req.user.username},(err,files)=>{
        if(err){
            debug(err);
        }
        res.render('viewfiles',{title:'NYX | my files',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:files});

    });

});



router.get('/view_publicfiles',aclfn,aclf,function(req,res){
    files.find({availability: 'public'},(err,files)=>{
        if(err){
            debug(err);
        }
        res.render('view_publicfiles',{title:'NYX | public files',user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},downloadRequest:files});

    });

});


router.get('/download/:id', function(req, res, next) {
// download a file
  var s=req.params.id;

  //res.redirect('/');
  var filePath = "../test/"+s; // Or format the path using the `id` rest param
  var fileName = s; // The default name the browser will us

  res.download(filePath, fileName);
  //res.render('index', { title: 'Express' });

});



//// for indivudual member registration
let User = require('../model/User');


///// End of individual member registration


module.exports = router;
