/**
 * Created by emalsha on 5/18/17.
 */
const Aria2 = require('aria2');

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

module.exports.aria2obj = aria2;