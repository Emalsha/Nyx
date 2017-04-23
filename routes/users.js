const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const Download = require('../model/Download');
const debug = require('debug')('nyx:userRoute');


let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(1,(req,res)=>{return req.user.username});

/* GET users listing. */
router.get('/dashboard',aclfn,aclf,function(req, res) {
    Download.find({request_user:req.user.username,state:'pending'})
        .then((pendingDonwload)=>{
            return [pendingDonwload];
        })
        .then((result)=>{
            return Download.find({request_user:req.user.username,state:'approved'})
                .then((approvedList) => {
                    result[1] = approvedList;
                    return result;
                })
        })
        .then((result)=>{
            return Download.find({request_user:req.user.username,state:'rejected'},null,{sort:{admin_decision_date:'asc'}})
                .then((rejectedList)=>{
                    result[2] = rejectedList;
                    return result;
                })
        })
        .then((result)=>{
            let pendingDonwload = result[0];
            let approvedList = result[1];
            let rejectedList = result[2];
            res.render('dashboard',{title:'NYX | Dashboard',message:req.flash('success'),user:{uname:req.user.username,name:req.user.fname +' '+ req.user.lname},pending:pendingDonwload,inprogress:approvedList,rejected:rejectedList});
        });

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
