/**
 * Created by emalsha on 5/8/17.
 */

const express = require('express');
const router = express.Router();
const request = require('request');
const debud = require('debug')('nyx:url_router');

router.post('/validate',function (req, res) {
    let url = decodeURIComponent(req.body.url);
    if(url){
        request({url:url,method:'HEAD'},(err,status)=>{
            if(err){
                res.send(false);
            }

            if(status.statusCode === 200){
                res.send(true);
            }else{
                res.send(false);
            }
        })
    }
});

module.exports = router;