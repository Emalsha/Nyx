/**
 * Created by emalsha on 5/12/17.
 */

const ns = require('node-schedule');
const debug = require('debug')('nyx:tm');
const ar = require('./ariac_runner');

// Define rule sh - start hour , sm - start minute
module.exports.setTimer = function(sh,sm,eh,em){
    // Start rule
    let start_rule = new ns.RecurrenceRule();
    start_rule.dayOfWeek = [new ns.Range(0,6)];
    start_rule.hour = sh;
    start_rule.minute = sm;

    // End rule
    let end_rule = new ns.RecurrenceRule();
    end_rule.dayOfWeek = [new ns.Range(0,6)];
    end_rule.hour = eh;
    end_rule.minute = em;

    ns.scheduleJob(start_rule,function(){
        ar.start_ariac();
    });

    ar.start_ariac(); // ***************************** tempory... must remove this... TODO
    ns.scheduleJob(end_rule,function(){
        ar.pause_ariac();
    });



};

