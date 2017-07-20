/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const debug = require('debug')('nyx:adminRouter');
const Download = require('../model/Download');
const Time = require('../model/Time');
const tm = require('../module/task_manager');
let passport = require('passport');


// Permission granting
let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(2, (req, res) => {
    return req.user.username
});

router.get('/management', aclfn, aclf, function (req, res) {
    res.render('userManagement', {
        title: 'NYX | User Management',
        user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname}
    });
});


router.get('/administration', aclfn, aclf, function (req, res) {
    Download.find({state: 'pending'}, (err, downloads) => {
        if (err) {
            debug(err);
        }
        res.render('administrator', {
            title: 'NYX | Administrator',
            user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
            downloadRequest: downloads
        });

    });

});

router.get('/viewfiles', aclfn, aclf, function (req, res) {
    Download.find({state: 'pending'}, (err, downloads) => {
        if (err) {
            debug(err);
        }
        res.render('viewfiles', {
            title: 'NYX | Administrator',
            user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
            downloadRequest: downloads
        });

    });

});

router.post('/server', aclfn, aclf, function (req, res) {

    if (req.body.start !== "" && req.body.end !== "") {

        let newTime = new Time({
            start: req.body.start,
            end: req.body.end,
            edit_by: req.user.username,
            edit_date: new Date()
        });

        newTime.save(function (err) {
            if (err) {
                res.send(false);
            } else {
                debug('save la;a');
                tm.setTimer();
                res.send(true);
            }
        })
    } else {
        res.send(false);
    }

});

router.get('/server_time', function (req, res) {
    Time.findOne({})
        .sort({'edit_date':-1})
        .select({'_id': 0, 'start': 1, 'end': 1,})
        .then(function (time) {
            res.send(time);
        })
});


router.get('/managepublicfiles', aclfn, aclf, function (req, res) {
    Download.find({availability: 'public', state: 'downloaded'}).sort({download_end_date: -1})
        .then((publicFiles) => {
            res.render('publicfile_mana', {
                title: 'NYX | Public File',
                user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
                publicFile: publicFiles
            });
        });

});

//delete public files
// delete a file

 router.get('/delete/:id/:id2', function(req, res, next) {

   var s=req.params.id;
   var x=req.params.id2;

   console.log(x);
   const fs = require('fs');
   //res.redirect('/');
   var filePath = "../test/"+s; // Or format the path using the `id` rest param
   var fileName = s; // The default name the browser will us

   fs.unlink(filePath);
   Download.findById(x,function(err,download){
     if(err) {
         debug(err);
     }
     download.state = 'deleted';

     download.save(function (err) {
         if(err){
             debug(err);
         }
         console.log("deleted");
         res.redirect('/admin/managepublicfiles');
     });


   })
   req.flash('success','File deleted.');
  //  res.download(filePath, fileName);
   //res.render('index', { title: 'Express' });

 });



//// for indivudual member registration
let User = require('../model/User');

router.post('/register', function (req, res, done) {

    let newUser = new User({
        fname: 'Emalsha',
        lname: 'Rasad',
        username: req.body.username,
        registrationNumber: 14020645,
        indexNumber: 14020645,
        role: 'user',
        created_at: new Date('2017-02-24'),
        updated_at: new Date('2017-05-14')
    });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', "Error on registration. " + err);
            res.redirect('/');
            res.send('false');
        }

        debug('New user registering.');
            acl.aclobj.addUserRoles(user.username,user.role);
            req.flash('success', "New account is successfully registered");
            res.redirect('/users/dashboard');


    })
});

///// End of individual member registration


module.exports = router;
