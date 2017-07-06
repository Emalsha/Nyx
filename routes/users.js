const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const Download = require('../model/Download');
const debug = require('debug')('nyx:userRoute');
const fs = require('fs');


let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(1, (req, res) => {
    return req.user.username
});

/* GET users listing. */
router.get('/dashboard', aclfn, aclf, function (req, res) {
    Download.find({request_user: req.user.username, state: 'pending'})
        .then((pendingDonwload) => {
            return [pendingDonwload];
        })
        .then((result) => {
            return Download.find({request_user: req.user.username, state: 'approved'})
                .then((approvedList) => {
                    result[1] = approvedList;
                    return result;
                })
        })
        .then((result) => {
            return Download.find({
                request_user: req.user.username,
                state: 'rejected'
            }, null, {sort: {admin_decision_date: 'asc'}})
                .then((rejectedList) => {
                    result[2] = rejectedList;
                    return result;
                })
        })
        .then((result) => {
            let pendingDonwload = result[0];
            let approvedList = result[1];
            let rejectedList = result[2];
            res.render('dashboard', {
                title: 'NYX | Dashboard',
                message: req.flash('success'),
                user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
                pending: pendingDonwload,
                inprogress: approvedList,
                rejected: rejectedList,
            });
        });

});

router.get('/myfile', aclfn, aclf, function (req, res) {
    Download.find({request_user: req.user.username, state: 'downloaded'}).sort({download_end_date: -1})
        .then((downloadedFile) => {
            res.render('myfile', {
                title: 'NYX | My File',
                user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
                myfile: downloadedFile
            });
        });

});

router.get('/publicfile', aclfn, aclf, function (req, res) {
    Download.find({availability: 'public', state: 'downloaded'}).sort({download_end_date: -1})
        .then((publicFiles) => {
            res.render('publicfile', {
                title: 'NYX | Public File',
                user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
                publicFile: publicFiles
            });
        });

});

router.get('/help', aclfn, aclf, function (req, res) {
    res.render('help', {
        title: 'NYX | Help',
        user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},

    });
});

router.get('/search', aclfn, aclf, function (req, res) {
    let search = decodeURIComponent(req.query.s);
    debug(search);
    Download.find({link: new RegExp(search, 'i'), state: 'downloaded', availability: 'public'})
        .select({
            'link': 1,
            '_id': 0,
            'request_date': 1,
            'admin_decision_date': 1,
            'admin': 1,
            'download_start_date': 1,
            'md5': 1,
            'availability':1,
            'admin_note':1,
            'description':1,
            'tags':1,
            'size':1
        })
        .then((searchResult) => {
            res.send(searchResult);
        })
});
// download a file
router.get('/download/:id', function(req, res, next) {
// download a file
  let id=req.params.id;
  Download.findById(id,function(err,download){
      if(err){
          debug(err);
      }

      let fileNameArr = download.link.split('/');
      let fileName=fileNameArr[fileNameArr.length -1];
      let filePath=download.file_path+'/'+fileName;
      debug('fPath: '+filePath);

      res.download(filePath,fileName);

  });

  // let filePath = "../test/"+s; // Or format the path using the `id` rest param
  // let fileName = s; // The default name the browser will us

    // res.download(filePath, fileName);

});
// delete a file

 router.get('/delete/:id', function(req, res, next) {

     let id=req.params.id;
     Download.findById(id,function(err,download){
         if(err){
             debug(err);
         }

         let fileNameArr = download.link.split('/');
         let fileName=fileNameArr[fileNameArr.length -1];
         let filePath=download.file_path+'/'+fileName;
         debug('fPath: '+filePath);

         fs.unlink(filePath);

         download.state = 'deleted';

         download.save(function (err) {
             if(err){
                 debug(err);
             }

             req.flash('success','File deleted.');
             res.redirect('/users/myfile');
         });

     });

   // let s=req.params.id;
   // let x=req.params.id2;
   //
   // let filePath = "../test/"+s; // Or format the path using the `id` rest param
   // let fileName = s; // The default name the browser will us
   //
   // fs.unlink(filePath);
   // Download.findById(x,function(err,download){
   //   if(err) {
   //       debug(err);
   //   }
   //   download.state = 'deleted';
   //
   //   download.save(function (err) {
   //       if(err){
   //           debug(err);
   //       }
   //       console.log("deleted");
   //       res.redirect('/users/myfile');
   //   });
   //
   //
   // });
   // req.flash('success','File deleted.');

 });




module.exports = router;
