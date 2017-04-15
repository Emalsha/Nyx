/**
 * Created by emalsha on 4/15/17.
 */

const express = require('express');
const router = express.Router();
const debug = require('debug')('nyx:router');

let Download = require('../model/Download');

router.post('/request',function(req,res){

    let newDownload = new Download({
        link:req.body.link,
        request_date:new Date(),
        request_user:req.user.username,
    });

    newDownload.save(function(err){
        if(err){ debug(err) };
        res.contentType('json');
        res.send({data:JSON.stringify(true)});

    })

});

// router.get('/getall',function (req, res) {
//     Download.find({},(err,downloads)=>{
//         if(err){
//             debug(err);
//         }
//         res.contentType('json');
//         res.send(downloads);
//     })
// });

module.exports = router;