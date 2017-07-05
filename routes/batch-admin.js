/**
 * Created by emalsha on 7/5/17.
 */

const express = require('express');
const router = express.Router();
const acl = require('../module/acl_fn');
const debug = require('debug')('nyx:adminRouter');
const Download = require('../model/Download');


// Permission granting
let aclf = acl.aclfnc();
let aclfn = acl.aclobj.middleware(2, (req, res) => {
    return req.user.username
});

router.get('/administration', aclfn, aclf, function (req, res) {
    Download.find({state: 'pending'}, (err, downloads) => {
        if (err) {
            debug(err);
        }
        res.render('batch-administrator', {
            title: 'NYX | Batch Rep',
            user: {uname: req.user.username, name: req.user.fname + ' ' + req.user.lname},
            downloadRequest: downloads
        });

    });

});

module.exports = router;
