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
const iface = Object.keys(ifaces)[len-1];
debug(iface);

let rxArray = fixed_array(12);
let txArray = fixed_array(12);

setInterval(function () {
    letrx = netstat.raw().iface.bytes.receive;
    rx = (rx/(1000*1000*1000));
    rxArray.push(rx);

    let tx = netstat.raw().iface.bytes.transmit;
    tx = (tx/(1000*1000*1000));
    txArray.push(tx);

},1000*60*5);

router.get('/network_usage', function(req, res, next) {

    let sendArray = [rxArray,txArray];
    res.send(sendArray);

});

module.exports = router;