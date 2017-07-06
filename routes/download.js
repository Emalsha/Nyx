/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const debug = require('debug')('nyx:router');

const ar = require('../module/ariac_runner');
let Download = require('../model/Download');
let Time = require('../model/Time');

router.post('/request',function(req,res){

    let tags_array;
    let availability;
    let description;
    let size;
    let file_path;

    if(req.body.tags){
        let st = req.body.tags;
        tags_array = st.split(',');
    }

    if(req.body.availability === 'true'){
        availability = 'public';
        file_path = __dirname+'/../tempDownload/public';
    }else{
        availability = 'private';
        file_path = __dirname+'/../tempDownload/'+ req.user.username ;
    }

    if(req.body.description){
        description = req.body.description;
    }

    if(req.body.size){
        size = req.body.size;
    }

    let newDownload = new Download({
        link:req.body.link,
        request_date:new Date(),
        tags:tags_array,
        availability:availability,
        request_user:req.user.username,
        state:'pending',
        description:description,
        size:size,
        file_path:file_path,
    });

    newDownload.save(function(err){
        if(err){ debug(err) }
        req.flash('success','New download request added.');
        res.redirect('/users/dashboard');
    })

});

// Approve download request handler
router.post('/approve',function(req,res){

    Download.findById(req.body.download_id,function(err,download){
        if(err) {
            debug(err);
        }

        if(req.body.new_tags){
            let st = req.body.new_tags;
            let tags_array = st.split(',');
            download.tags = download.tags.concat(tags_array);
        }

        if(req.body.priority){
            download.priority = req.body.priority;
        }

        if(req.body.admin_note){
            download.admin_note = req.body.admin_note;
        }

        if(req.body.availability === 'true'){
            download.availability = 'public';
            download.file_path = __dirname+'/../tempDownload/public';
        }else{
            download.availability = 'private';
            download.file_path = __dirname+'/../tempDownload/'+ req.user.username;
        }

        download.admin = req.user.username;
        download.admin_decision = true;
        download.admin_decision_date = new Date();
        download.state = 'approved';

        download.save(function (err) {
            if(err){
                debug(err);
            }

            Time.findOne({})
                .sort({'edit_date': -1})
                .select({'_id': 0, 'start': 1, 'end': 1,})
                .then(function (time) {
                    let sm = 0, em = 0;
                    console.log(time);
                    let t = new Date();
                    let nowTime = t.getHours();
                    if(nowTime){ //TODO : time select proooo
                        ar.start_ariac();
                    }

                    res.redirect(req.header('Referer'));
                });

        });

    })

});

// Reject download request handler
router.post('/reject',function(req,res){

    Download.findById(req.body.download_id,function(err,download){
        if(err) {
            debug(err);
        }


        if(req.body.reason){
            download.reject_note = req.body.reason;
        }

        if(req.body.admin_note){
            download.admin_note = req.body.admin_note;
        }

        download.admin = req.user.username;
        download.admin_decision = false;
        download.admin_decision_date = new Date();
        download.state = 'rejected';

        download.save(function (err) {
            if(err){
                debug(err);
            }

            res.redirect(req.header('Referer'));
        });

    })

});

module.exports = router;