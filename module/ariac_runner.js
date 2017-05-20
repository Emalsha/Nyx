/**
 * Created by emalsha on 5/13/17.
 */

const Aria2 = require('aria2');
const debug = require('debug')('nyx:ariac');

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
    debug('Download start > GID : ' + msg.gid);
};

aria2.onDownloadComplete = function (msg) {
    debug('Download completed on > GID :' + msg.gid);
};

aria2.onDownloadError = function (msg) {
    debug('Error on : ' + msg.gid);
};

let start_ariac = function () {

    aria2.open().then(function () {
        debug('Web socket is open');
    }).then(function () {

        getDownloadRequest(function(ar){

            for (let i = 0; i < ar.length ; i++) {
                aria2.addUri([ar[i]], function (err, res) {
                    // debug(err || res);
                })
            }
        });
    });

};

let pause_ariac = function () {
    aria2.pauseAll(function(err,res){
        console.log(err || res);
    })
};

function getDownloadRequest(cb) {
    Download.find({state: 'approved', admin_decision: true}, function (err, downloads) {
        if (err) {
            debug(err);
        }
        let array = [];
        for(let i=0;i<downloads.length;i++){
            array.push(downloads[i]['link']);
        }

        cb(array);

    });
}

module.exports.start_ariac = start_ariac;
module.exports.pause_ariac = pause_ariac;