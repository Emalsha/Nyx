/**
 * Created by emalsha on 5/12/17.
 */

const ns = require('node-schedule');
const debug = require('debug')('nyx:tm');
const ar = require('./ariac_runner');

// Define rule
module.exports.setTimer = function(h,m){
    let rule = new ns.RecurrenceRule();

    rule.dayOfWeek = [new ns.Range(0,6)];
    rule.hour = h;
    rule.minute = m;

    ns.scheduleJob(rule,function(){

        ar.ariac();

    });
};

