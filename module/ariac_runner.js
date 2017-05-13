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
    debug('Msg : ' + msg);
    console.log(msg);
};

let start_ariac = function () {

    aria2.open().then(function () {
        debug('Web socket is open');
    }).then(function () {
        let ar = ['https://www.w3schools.com/css/trolltunga.jd', 'https://www.w3schools.com/css/trolltunga.jpg', 'https://www.w3schools.com/css/trolltunga.jpg', 'https://www.w3schools.com/css/trolltunga.jpg'];
        for (let i = 0; i < ar.length; i++) {
            aria2.addUri([ar[i]], function (err, res) {
                debug(err || res);
            })
        }
    });

};

let pause_ariac = function () {
    aria2.pauseAll(function(err,res){
        console.log(err || res);
    })
};

function getDownloadRequest() {
    Download.find({state: 'approved', admin_decision: true}, function (err, users) {
        if (err) {
            debug(err);
        }

        console.log(users);

    });
}

module.exports.start_ariac = start_ariac;
module.exports.pause_ariac = pause_ariac;