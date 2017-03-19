/**
 * Created by emalsha on 3/19/17.
 */

var netstat = require('net-stat');


setInterval(function(data){
    console.log(netstat.raw().wlp2s0);
},1000);

1000*1000

