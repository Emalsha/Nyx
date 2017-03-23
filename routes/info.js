/**
 * Created by emalsha on 3/20/17.
 */

const express = require('express');
const router = express.Router();
const netstat = require('net-stat');
const fixed_array = require('fixed-array');
const server = express.server;
const os = require('os');
const debug = require('debug')('nyx:info');

// Get network interface
let ifaces = os.networkInterfaces();
let len = Object.keys(ifaces).length;
const reqIface = Object.keys(ifaces)[len-1];
debug(`Get data from : ${reqIface}`);

let rxArray = fixed_array(30);
let txArray = fixed_array(30);

setInterval(function () {

    let rxfn = netstat.usageRx({iface:reqIface,units:'MiB',sampleMs:'1000'},rx =>{
        rxArray.push(rx );
    });

    let txfn = netstat.usageTx({iface:reqIface,units:'MiB',sampleMs:'1000'},tx =>{
        txArray.push(tx);
    });

},1000);

router.get('/network_usage', function(req, res, next) {

    let sendArray = [rxArray,txArray];
    res.send(sendArray);

});

module.exports = router;