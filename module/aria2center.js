/**
 * Created by sulochana on 7/22/17.
 */

let Aria2 = require('aria2');
let connected = false;
let systemonline = false;
let nothingtodownload = false;
const cast = require('../module/globalutils');
const aria2secret = "ucscaria";
const DOWNLOAD_ROOT = "/home/sulochana/Desktop/downloads/";
const Time = require('../model/Time');
const Download = require('../model/Download');
const debug = require('debug')('nyx:aria2center');
const Owner = require('../model/Owner');
const fs = require('fs');
const crypto = require('crypto');

var MAX_CONCIRRENT_DOWNLOADS = 2;
var statusnsp;

//main variables

var io;
var p_s = 17;
var p_e = 8;

let option = {
    secure: false,
    host: 'localhost',
    port: 6800,
    secret: aria2secret,
    path: '/jsonrpc'
};

const aria2 = new Aria2(option);

//startups


//exports
exports.open = function(){
    cast.log("Manually opening aria2c socket ...",7);
    aria2.open().then(function () {
        cast.log("Manually opened aria2c socket.",7);
    });
};

exports.close = function(){
    cast.log("Manually closing aria2c socket ...",7);
    aria2.close().then(function () {
        cast.log("Manually closed aria2c socket.",7);
    });
};

exports.connected = function () {
    return connected;
};

exports.download = function newDownloadRequest(data, callback) {
    addDownloadUri(data, function(pass1_data) {
        callback(pass1_data);
    });
};

exports.init = function (inc_io) {
    cast.log("Socket data passed to Aria2 Center");
    io = inc_io;
    statusnsp = io.of('/status');

    statusnsp.on('connection', function(socket){
        socket.on('getstatus', function (data) {
            console.log(data);
            var dfd = setInterval(function () {
                aria2.tellStatus(data.gid,function (err,data) {
                    socket.emit('dlstatus_'+data.gid,data);
                });
                if (socket.disconnected){
                    cast.log("Broadcasting stopped for " + socket.id);
                    clearInterval(dfd);
                }
            },1000);
        });


    });

};

exports.updatetime = function updatetime(inc_io) {
    Time.find({}).sort({edit_date: -1})
        .then((timex) => {
            // console.log(timex);
            p_s = parseInt(timex[0].start);
            p_e = parseInt(timex[0].end);
        });
};

function addDownloadUri(data, callback) {
    // after some calculation
    url = data[0];
    mount = data[1];
    file_id = data[2];
    speedlimit = data[3];
    connections = data[4];
    if (connections === undefined){
        connections = 1;
    }
    if (speedlimit === undefined){
        speedlimit = "0";
    }
    let options = {
        'dir': DOWNLOAD_ROOT + mount,
        'out': file_id,
        'max-download-limit': speedlimit,
        'max-connection-per-server': connections
    };
    cast.log("Adding " + file_id + " to download queue...",7);
    aria2.addUri([url],options,function (err, gid) {
        if ( err === null){
            callback(gid);
        }else {
            callback(undefined);
        }
    });

}

module.exports.aria2obj = aria2;


//aria2 events
aria2.onopen = function() {
    connected = true;
    cast.log("Opening aria2c socket success.",7);
};

aria2.onclose = function() {
    connected = false;
    cast.log("Closing aria2c socket success.",7);
};

aria2.onsend = function(m) {
    // console.log('aria2 OUT', m);
};

aria2.onDownloadComplete = function (gid) {
    cast.log("Download of GID:"+gid.gid + " Completed.",7);

    Download.find({gid: gid.gid}, function (err, downloads) {
        let download = downloads[0];
        console.log(download);
        var promise_a = new Promise(function (resolve,reject) {
            var lock = true;
            while (lock){
                if (download.link !== undefined){
                    lock = false;
                    resolve(0);
                }
            }
        });

        promise_a.then(function successHandler(result) {
            let fileNameArr = download.link.split('/');
            let fileName = fileNameArr[fileNameArr.length - 1];
            fileName = decodeURIComponent(fileName);
            let dirPath = download.file_path;
            let filePath = dirPath + '/' + fileName;
            debug('fPath: ' + filePath);
            // Generate hash value
            fs.createReadStream(filePath).pipe(crypto.createHash('sha1').setEncoding('hex')).on('finish', function () {
                let hashVal = this.read(); //the hash
                debug('fhash: ' + hashVal);
                let newPath = dirPath + '/' + hashVal;
                // Rename file to hash value
                cast.log("Attemting to rename " + fileName + " to " + hashVal);
                fs.rename(filePath, newPath, function (err) {
                    if (err) {
                        cast.log("Error occured while renamed " + fileName + " to " + hashVal + ". " +err,3);
                        // console.log('ERROR: ' + err);
                    }else{
                        cast.log("Successfully renamed " + fileName + " to " + hashVal);

                        // Update database
                        Download.findOneAndUpdate({gid: gid.gid}, {
                            state: 'downloaded',
                            download_end_date: new Date(),
                            file_path:newPath,
                        }, (err, res) => {
                            if (err) {
                                cast.log("Error occured while updating the database after renaming " + fileName + " to " + hashVal + ". " +err,3);
                            }else{
                                cast.log("Database successfully updated after renaming " + fileName + " to " + hashVal,3);
                                //TODO : Create ownership records according to file

                            }
                        });

                    }



                });
            });
        },function failureHandler(error) {

        });

    });
};

aria2.onDownloadStart = function(gid) {
    // console.log(gid);
    /*
    * { bitfield: 'ffc0',
     completedLength: '10485760',
     connections: '0',
     dir: '/home/sulochana/Desktop/downloads/1',
     downloadSpeed: '0',
     errorCode: '0',
     files:
     [ { completedLength: '10485760',
     index: '1',
     length: '10485760',
     path: '/home/sulochana/Desktop/downloads/1/10MB.zip',
     selected: 'true',
     uris: [Object] } ],
     gid: '608240877711e05b',
     numPieces: '10',
     pieceLength: '1048576',
     status: 'complete',
     totalLength: '10485760',
     uploadLength: '0',
     uploadSpeed: '0' }
     */
    cast.log("Download of GID:"+gid.gid + " Initiated.",7);

};

aria2.onDownloadPause = function(gid) {
    // console.log(gid);
    cast.log("Download of GID:"+gid.gid + " Paused.",7);
};

aria2.onDownloadStop = function(gid) {
    // console.log(gid);
    cast.log("Download of GID:"+gid.gid + " Stopped.",7);
};

aria2.onDownloadError = function(gid) {
    // console.log(gid);
    cast.log("Download of GID:"+gid.gid + " Error.",3);
    Download.findOneAndUpdate({gid: gid.gid}, {
        state: 'error',
        download_end_date: new Date(),
    }, (err, res) => {
        if (err) {
            cast.log("Error occured while updating the database occurring the error at download" +err,3);
        }else{
            cast.log("Database successfully updated after error occurred at downloading",3);
            //TODO : Create ownership records according to file

        }
    });
};

function online_main() {
    var ongoing_downloads;
    systemonline = true;
    if (systemonline){

        var request_a_a = new Promise(function(resolve, reject) {
            aria2.tellActive( function (err,data) {
                if (err !== null){
                    reject(err);
                    cast.log("Error occurred while retrieving the active downloads from Aria2c",2);
                }else {
                    resolve(data);
                }
            })
        });

        request_a_b = request_a_a.then(function successHandler(result) {
            /*
            * { bitfield: 'e0',
             completedLength: '4014080',
             connections: '1',
             dir: '/home/sulochana/Desktop/downloads/1',
             downloadSpeed: '734982',
             files: [ [Object] ],
             gid: 'f8071f7549eb5ccf',
             numPieces: '5',
             pieceLength: '1048576',
             status: 'active',
             totalLength: '5242880',
             uploadLength: '0',
             uploadSpeed: '0' }*/

            // add downloads until limit
            Download.find({state: 'approved'})
                .then((pendingDonwload) => {
                    var i;

                    if (pendingDonwload.length > 0){
                        if (nothingtodownload){
                            nothingtodownload = false;
                            cast.log("New downloads found.");
                        }
                        for (i=0;i<(MAX_CONCIRRENT_DOWNLOADS - result.length);i++){
                            const selection = i;

                            if (pendingDonwload[selection] !== undefined){

                                // console.log(pendingDonwload[selection].link,selection,pendingDonwload.length);

                                url = pendingDonwload[selection].link;
                                mount = 1;
                                file_id = new Date().getTime();
                                speedlimit = "2M";
                                connections = 1;

                                let options = {
                                    'dir': DOWNLOAD_ROOT + mount,
                                    'out': file_id,
                                    'max-download-limit': speedlimit,
                                    'max-connection-per-server': connections
                                };
                                cast.log("Adding " + file_id + " to download queue...",7);
                                aria2.addUri([url],options,function (err, gid) {
                                    if ( err === null){
                                        cast.log("Adding " + file_id + " to download success...",7);

                                        Download.findById(pendingDonwload[selection].id,function(err,download){
                                            if(err){
                                                debug(err);
                                            }

                                            download.state = 'downloading';
                                            download.file_path = DOWNLOAD_ROOT + mount;
                                            download.gid = gid;


                                            download.save(function (err) {
                                                if(err){
                                                    debug(err);
                                                }
                                            });

                                        });
                                    }else {
                                        cast.log("Adding " + file_id + " to download failed...",7);
                                    }
                                });

                            }else {
                                cast.log("Maxing out the download queue.");
                                i = MAX_CONCIRRENT_DOWNLOADS;
                            }


                        }
                    }else {
                        //nothing to download.
                        if (!nothingtodownload){
                            nothingtodownload = true;
                            cast.log("No new approved download requests detected.");
                        }
                    }

                });

            // console.log(result,"red");
        }, function failureHandler(error) {
            cast.log("New downloads were not queued as the ongoing download list was not recieved.",3);
            //handle
        });


    }

}


function offline_main() {
    if (systemonline){
        systemonline = false;
        aria2.pauseAll();
    }
}


var mainloop = setInterval(function () {
    if (io === undefined){return}

    var status = "Offline";
    var timeleft = "N\\A";
    var uncommon = false;
    var precent = 0;

    var now = new Date();
    var peak_start = new Date(now.getYear()+1900,now.getMonth(),now.getDate(),p_s,0,0);
    var peak_stop = new Date(now.getYear()+1900,now.getMonth(),now.getDate(),p_e,0,0);
    var next_peak_start = new Date(now.getYear()+1900,now.getMonth(),now.getDate()+1,p_s,0,0);
    var timetogo = new Date();
    var timepassed = new Date();
    if (p_e < p_s){
        uncommon = true;
        if (peak_start.getHours() <= now.getHours()){
            peak_stop.setDate(now.getDate()+1);
        }else {
            next_peak_start.setDate(next_peak_start.getDate()-1);
            peak_start.setDate(now.getDate()-1);
        }
    }else{
        if (peak_stop.getHours() <= now.getHours()){
            peak_start.setDate(now.getDate()+1);
        }else {
            next_peak_start.setDate(next_peak_start.getDate()-1);
        }
    } //i assume my logic is correct

    //online status
    if (peak_start.getTime() < now.getTime() && now.getTime() < peak_stop.getTime()){
        //peak
        status = "Offline";
        timetogo = peak_stop.getTime()-now.getTime();
        timepassed = now - peak_start.getTime();

        timeleft = "Going online in " + (Math.floor(timetogo/(1000*60*60))) + " hours " + Math.floor(timetogo/(1000*60))%60 + "mins and "+ (Math.floor(timetogo/(1000))%60)%60 + " secs.";
        precent = Math.floor(((now - peak_start)/(peak_stop - peak_start))*100)

        offline_main();
    }else {
        //off peak
        status = "Online";
        timetogo = next_peak_start.getTime()-now.getTime();
        timepassed = now - peak_stop;

        timeleft = "Going offline in " + (Math.floor(timetogo/(1000*60*60))) + " hours " + Math.floor(timetogo/(1000*60))%60 + "mins and "+ (Math.floor(timetogo/(1000))%60)%60 + " secs.";
        precent = Math.floor(((now - peak_stop)/(next_peak_start - peak_stop))*100);

        online_main();
    }

    io.emit('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}' );
    // console.log('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}' );
},1000);


//codes
