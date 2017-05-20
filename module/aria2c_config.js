/**
 * Created by emalsha on 5/18/17.
 */
const Aria2 = require('aria2');
const debug = require('debug')('nyx:aria-config');
const Download = require('../model/Download');

let option = {
    secure: false,
    host: 'localhost',
    port: 6800,
    secret: 'ucscaria',
    path: '/jsonrpc'
};

const aria2 = new Aria2(option);

aria2.onDownloadStart = function (msg) {

    Download.findOneAndUpdate({gid: msg.gid}, {state: 'downloading'},(err,res)=>{
        if(err){
            debug('Download start file update fail : '+err);
        }
    });
};

aria2.onDownloadComplete = function (msg) {
    Download.findOneAndUpdate({gid: msg.gid}, {state: 'downloaded',download_end_date:new Date()},(err,res)=>{
        if(err){
            debug('Downloaded file update fail : '+err);
        }
    });
};

aria2.onDownloadError = function (msg) {
    Download.findOneAndUpdate({gid: msg.gid}, {state: 'downloadError',download_end_date:new Date()},(err,res)=>{
        if(err){
            debug('Downloaded error file update fail : '+err);
        }
    });
};

module.exports.aria2obj = aria2;