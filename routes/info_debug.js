/**
 * Created by emalsha on 3/20/17.
 */

var express = require('express');
var router = express.Router();
var netstat = require('net-stat');
var fixed_array = require('fixed-array');
var server = express.server;

var rxArray = fixed_array(86400);
var txArray = fixed_array(86400);
var rx_last_value = 0;
var tx_last_value = 0;


setInterval(function () {
    //GET RX
    var rx = netstat.raw().wlp5s0.bytes.receive;
    rxArray.push(rx-rx_last_value);
    rx_last_value = rx;


    //GET TX
    var tx = netstat.raw().wlp5s0.bytes.transmit;
    txArray.push(tx-tx_last_value);
    tx_last_value=tx;
    console.log("RX Speed", getRXps()/1024,"kbps");
    console.log("TX Speed", getTXps()/1024,"kbps");

},1000);

router.get('/network_usage', function(req, res, next) {

    var sendArray = [rxArray,txArray];
    res.send(sendArray);

});

function getRXps() {
    return rxArray.array[rxArray.length()-1];
}

function getTXps() {
    return txArray.array[txArray.length()-1];
}


function getRX() {
    return netstat.raw().wlp5s0.bytes.receive;
}

function getTX() {
    return netstat.raw().wlp5s0.bytes.transmit;
}

module.exports = router;