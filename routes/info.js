/**
 * Created by emalsha on 3/20/17.
 */

var express = require('express');
var router = express.Router();
var netstat = require('net-stat');
var fixed_array = require('fixed-array');

var rxArray = fixed_array(12);
var txArray = fixed_array(12);
router.get('/network_usage', function(req, res, next) {

    var rx = netstat.raw().wlp2s0.bytes.receive;
    rx = (rx/(1000*1000*1000));
    rxArray.push(rx);

    var tx = netstat.raw().wlp2s0.bytes.transmit;
    tx = (tx/(1000*1000*1000));
    txArray.push(tx);

    var sendArray = [rxArray,txArray];
    res.send(sendArray);

});

module.exports = router;