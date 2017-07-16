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


//foldersize
var getFolderSize = require('get-folder-size');
var converter = require('convert-units');
var disk = require('diskusage');
var RX = 0,TX = 0;

//SYSINFP
let ram_usage = fixed_array(60);
let cpu_load = fixed_array(60);
var ostb = require( 'os-toolbox' );



module.exports = function App(io) {
    setInterval(function () {

//Online Offline Status

        //get these vals from the database
        var p_s = 17;
        var p_e = 8;

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


//Net Stat
        let rxfn = netstat.usageRx({iface:reqIface,units:'bytes',sampleMs:'1000'},rx =>{
            rxArray.push(rx/(1024*1024));
            RX = rx;
        });

        let txfn = netstat.usageTx({iface:reqIface,units:'bytes',sampleMs:'1000'},tx =>{
            txArray.push(tx/(1024*1024));
            TX = tx;
        });
        var swap_rxtx = 0;
        if (TX > RX){
            swap_rxtx = 1;
        }
        io.emit('stat_net_network',[rxArray,txArray] );
        var rx_prec = Math.round(RX*100/12000000);
        var tx_prec = Math.round(TX*100/6000000);
        RX =converter(RX).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});


        TX =converter(TX).from('B').toBest({exclude: ['Kb','Mb','Gb','Tb']});
        io.emit('system_rxtx','{"rx": "'+ RX.val.toFixed(2) +'","rxUnit": "'+ RX.unit +'","tx": "'+ TX.val.toFixed(2) +'","txUnit": "'+ TX.unit +'","rxprecent":"'+rx_prec+'","txprecent":"'+tx_prec+'","swap":"' + swap_rxtx + '"}' );
        // console.log('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}');


//system memory and load
        ostb.memoryUsage().then(function(memusage){
            ram_usage.push(memusage); //ex: 93 (percent)
            ostb.cpuLoad().then(function(cpuusage){
                cpu_load.push(cpuusage);
            });
            io.emit('system_memory_usage',[ram_usage,cpu_load] );

        }, function(error){
            console.log("Error while retireving memory usage");
        });
        //console.log(RX,TX)

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


