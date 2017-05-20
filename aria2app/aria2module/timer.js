/**
 * Created by emalsha on 3/22/17.
 */

var ns = require('node-schedule');
var Aria2 = require('aria2');

var rule = new ns.RecurrenceRule();
var aria = new Aria2();

// rule.dayOfWeek = [new ns.Range(0,6)];
// rule.hour = 2;
// rule.minute = 3;
//
// var fn = ns.scheduleJob(rule,function () {
//     console.log('Sheduled date..');
// });

let startTime = new Date(Date.now() + 5000);
let endTime = new Date(startTime.getTime() + 5000);
var j = ns.scheduleJob({ start: startTime, end: endTime, rule: '*/1 * * * * *' }, function(){
    console.log('Time for tea!');
});