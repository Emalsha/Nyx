/**
 * Created by sulochana on 7/22/17.
 */

let Aria2 = require('aria2');
let connected = false;
let systemonline = false;
const cast = require('../module/globalutils');
const aria2secret = "ucscaria";
const DOWNLOAD_ROOT = "/home/sulochana/Desktop/downloads/";
const Time = require('../model/Time');

//main variables

var io;
var p_s = 17;
var p_e = 8;

let option = {
    secure: false,
    host: global.ipaddress,
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
    io = inc_io;
};

exports.updatetime = function updatetime(inc_io) {
    Time.find({}).sort({edit_date: -1})
        .then((timex) => {
            console.log(timex);
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
    console.log('aria2 OUT', m);
};

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
    }else {
        //off peak
        status = "Online";
        timetogo = next_peak_start.getTime()-now.getTime();
        timepassed = now - peak_stop;

        timeleft = "Going offline in " + (Math.floor(timetogo/(1000*60*60))) + " hours " + Math.floor(timetogo/(1000*60))%60 + "mins and "+ (Math.floor(timetogo/(1000))%60)%60 + " secs.";
        precent = Math.floor(((now - peak_stop)/(peak_stop - peak_start))*100)
    }

    io.emit('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}' );
    // console.log('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}' );
},1000);


//codes
