/**
 * Created by sulochana on 5/20/17.
 */

const netstat = require('net-stat');
const fixed_array = require('fixed-array');
const os = require('os');
const debug = require('debug')('nyx:info');

// Get network interface
let ifaces = os.networkInterfaces();
let len = Object.keys(ifaces).length;
const reqIface = Object.keys(ifaces)[len-1];
debug(`Get data from : ${reqIface}`);
let rxArray = fixed_array(60);
let txArray = fixed_array(60);


var peak_upper_limit = 19;
var peak_lower_limit = 6;


//foldersize
var getFolderSize = require('get-folder-size');
var converter = require('convert-units');
var disk = require('diskusage');
var RX = 0,TX = 0;



module.exports = function App(io) {
    setInterval(function () {

        let rxfn = netstat.usageRx({iface:reqIface,units:'bytes',sampleMs:'1000'},rx =>{
            rxArray.push(rx/(1024*1024));
            RX = rx;
        });

        let txfn = netstat.usageTx({iface:reqIface,units:'bytes',sampleMs:'1000'},tx =>{
            txArray.push(tx/(1024*1024));
            TX = tx;
        });

        //Net Stat
        io.emit('stat_net_network',[rxArray,txArray] );

        //Online Offline Status
        var now = new Date();
        // var now = date.getTime();
        var hh = now.getHours();


        var status = "Offline";
        var timeleft = "N\\A";
        var precent = 0;
        if (peak_upper_limit > peak_lower_limit){
            //case 01
            if (hh >= peak_lower_limit && hh <peak_upper_limit){
                //offline
                status = "Offline";

                var limit_ul = new Date();
                limit_ul.setHours(peak_upper_limit);
                limit_ul.setMinutes(0);
                limit_ul.setSeconds(0);
                var dif = Math.abs(limit_ul - now);
                timeleft = "Going online in " + (Math.floor(dif/(1000*60*60))) + " hours " + Math.floor(dif/(1000*60))%60 + "mins and "+ (Math.floor(dif/(1000))%60)%60 + " secs." ;

                var tl_x = new Date();
                tl_x.setHours(peak_lower_limit);
                tl_x.setMinutes(0);
                tl_x.setSeconds(0);
                precent = 100-Math.round(Math.abs(dif/Math.abs(tl_x-limit_ul)*100));

                // console.log(timeleft,status);



            }else{
                //online
                status = "Online";
                var limit_ul = new Date();
                limit_ul.setHours(peak_lower_limit);
                limit_ul.setDate(limit_ul.getDate());
                limit_ul.setMinutes(0);
                limit_ul.setSeconds(0);
                var dif = Math.abs(limit_ul - now);
                timeleft = "Going offline in " + (Math.floor(dif/(1000*60*60))) + " hours " + Math.floor(dif/(1000*60))%60 + "mins and "+ (Math.floor(dif/(1000))%60)%60 + " secs." ;


                var tl_x = new Date();
                tl_x.setHours(peak_upper_limit);
                tl_x.setMinutes(0);
                tl_x.setSeconds(0);
                precent = 100-Math.round(Math.abs(dif/Math.abs(tl_x-limit_ul)*100));
                // console.log(timeleft,status);

            }
        }else{
            //case 02
            if (hh > peak_upper_limit && hh <=peak_lower_limit){
                //online
                status = "Online";
                var limit_ul = new Date();
                limit_ul.setHours(peak_lower_limit);
                limit_ul.setMinutes(0);
                limit_ul.setSeconds(0);
                var dif = Math.abs(now-limit_ul);
                timeleft = "Going offline in " + (Math.floor(dif/(1000*60*60))) + " hours " + Math.floor(dif/(1000*60))%60 + "mins and "+ (Math.floor(dif/(1000))%60)%60 + " secs." ;


                var tl_x = new Date();
                tl_x.setHours(peak_upper_limit);
                tl_x.setMinutes(0);
                tl_x.setSeconds(0);
                precent = 100-Math.round(Math.abs(dif/Math.abs(tl_x-limit_ul)*100));
                // console.log(timeleft,status);

            }else{
                //offline
                status = "Offline";
                var limit_ul = new Date();
                limit_ul.setHours(peak_upper_limit);
                limit_ul.setDate(limit_ul.getDate()+1);
                limit_ul.setMinutes(0);
                limit_ul.setSeconds(0);
                var dif = Math.abs(now-limit_ul);
                timeleft = "Going online in " + (Math.floor(dif/(1000*60*60))) + " hours " + Math.floor(dif/(1000*60))%60 + "mins and "+ (Math.floor(dif/(1000))%60)%60 + " secs." ;

                var tl_x = new Date();
                tl_x.setHours(peak_lower_limit);
                tl_x.setMinutes(0);
                tl_x.setSeconds(0);
                precent = 100-Math.round(Math.abs(dif/Math.abs(tl_x-limit_ul)*100));
                // console.log(timeleft,status);
            }
        }
        RX =converter(RX).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
        TX =converter(TX).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});

        io.emit('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}' );
        io.emit('system_rxtx','{"rx": "'+ RX.val.toFixed(2) +'","rxUnit": "'+ RX.unit +'","tx": "'+ TX.val.toFixed(2) +'","txUnit": "'+ TX.unit +'"}' );
        // console.log('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}');
        //console.log(RX,TX);








    },1000);

    setInterval(function () {
        var myFolder = ".";
        var storageAllocation = 100000000; //Bytes
        getFolderSize(myFolder, function(err, size) {
            if (err) { throw err; }
            var used = converter(size).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
            var total = converter(storageAllocation).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
            //console.log(used);
            io.emit('user_storage_usage','{"used": "'+ used.val.toFixed(2) +'","usedUnit": "'+ used.unit +'","allocated": "'+ total.val.toFixed(2) +'","allocatedUnit": "'+ total.unit +'","progress":"'+ Math.round(size*100/storageAllocation)+'"}' );


        });

        disk.check('/', function(err, info) {

            var total = converter(info.total).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
            var available = converter(info.available).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
            var used = converter(info.total - info.available).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
            //{"used": "35","usedUnit": "MB","available": "100","availableUnit": "MB","total": "100","totalUnit": "GB"}
            io.emit('system_storage_usage','{"used": "'+ used.val.toFixed(2) +'","usedUnit": "'+ used.unit +'","available": "'+ available.val.toFixed(2) +'","availableUnit": "'+ available.unit +'","total": "'+ total.val.toFixed(2) +'","totalUnit": "'+total.unit +'","progress":"'+  Math.round((info.total-info.available)*100/info.total) +'"}' );
        });

    },5000);
};


