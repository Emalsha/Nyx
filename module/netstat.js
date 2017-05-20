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

module.exports = function App(io) {
    setInterval(function () {

        let rxfn = netstat.usageRx({iface:reqIface,units:'MiB',sampleMs:'1000'},rx =>{
            rxArray.push(rx);
        });

        let txfn = netstat.usageTx({iface:reqIface,units:'MiB',sampleMs:'1000'},tx =>{
            txArray.push(tx);
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
                limit_ul.setDate(limit_ul.getDate()+1);
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
        io.emit('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}' );
        // console.log('online_status_info','{"status": "'+ status +'","eta": "'+ timeleft+'","precent":'+precent+'}');
        //console.log(io.engine.clientsCount);




    },1000);
};