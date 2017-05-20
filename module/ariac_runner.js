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
                let option = {'dir': __dirname + '/../tempDownload'}; //TODO : This path should take from database according to download file.
                aria2.addUri([ar[i]], option, function (err, res) {

                    if (err) {
                        debug(err);
                    } else {

                        Download.findOneAndUpdate({
                            link: ar[i],
                            state: 'approved',
                            admin_decision: true
                        }, {gid: res, download_start_date: new Date()}, (err, dres) => {
                            if (err) {
                                debug('Download update failed. Link :' + ar[i]);
                            }
                        })
                    }

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