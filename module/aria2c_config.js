/**
 * Created by emalsha on 5/18/17.
 */
const Aria2 = require('aria2');
const debug = require('debug')('nyx:aria-config');
const Download = require('../model/Download');
const Owner = require('../model/Owner');
const fs = require('fs');
const crypto = require('crypto');

let option = {
    secure: false,
    host: 'localhost',
    port: 6800,
    secret: 'ucscaria',
    path: '/jsonrpc'
};

const aria2 = new Aria2(option);

aria2.onDownloadStart = function (msg) {

    Download.findOneAndUpdate({gid: msg.gid}, {state: 'downloading'}, (err, res) => {
        if (err) {
            debug('Download start file update fail : ' + err);
        }
    });
};

aria2.onDownloadComplete = function (msg) {

    Download.find({gid: msg.gid}, function (err, downloads) {
        let download = downloads[0];
        console.log(download);
        let fileNameArr = download.link.split('/');
        let fileName = fileNameArr[fileNameArr.length - 1];
        let dirPath = download.file_path;
        let filePath = dirPath + '/' + fileName;
        debug('fPath: ' + filePath);

        // Generate hash value
        fs.createReadStream(filePath).pipe(crypto.createHash('sha1').setEncoding('hex')).on('finish', function () {
            let hashVal = this.read(); //the hash
            debug('fhash: ' + hashVal);
            let newPath = dirPath + '/' + hashVal;
            // Rename file to hash value
            fs.rename(filePath, newPath, function (err) {
                if (err) console.log('ERROR: ' + err);

                // Update database
                Download.findOneAndUpdate({gid: msg.gid}, {
                    state: 'downloaded',
                    download_end_date: new Date(),
                    file_path:newPath,
                }, (err, res) => {
                    if (err) {
                        debug('Downloaded file update fail : ' + err);
                    }else{
                        //TODO : Create ownership records according to file

                    }
                });

            });
        });
    });


};

aria2.onDownloadError = function (msg) {
    Download.findOneAndUpdate({gid: msg.gid}, {state: 'downloadError', download_end_date: new Date()}, (err, res) => {
        if (err) {
            debug('Downloaded error file update fail : ' + err);
        }
    });
};

module.exports.aria2obj = aria2;