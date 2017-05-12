/**
 * Created by emalsha on 5/13/17.
 */

const Aria2 = require('aria2');
const debug = require('debug')('nyx:ariac');

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

module.exports.ariac = function () {

    aria2.open().then(function () {
        debug('Web socket is open');
    }).then(aria2.addUri(['https://www.w3schools.com/css/trolltunga.jpg'], function (err, res) {
        debug(err || res);
    }));

};
