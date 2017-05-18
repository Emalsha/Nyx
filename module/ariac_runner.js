/**
 * Created by emalsha on 5/13/17.
 */

const aria2 = require('./aria2c_config').aria2obj;
const debug = require('debug')('nyx:ariac');

const Download = require('../model/Download');

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