/**
 * Created by emalsha on 5/12/17.
 */

const ns = require('node-schedule');
const debug = require('debug')('nyx:tm');
const ar = require('./ariac_runner');
const Time = require('../model/Time');

// Define rule sh - start hour , sm - start minute
module.exports.setTimer = function () {

    Time.findOne({})
        .sort({'edit_date': -1})
        .select({'_id': 0, 'start': 1, 'end': 1,})
        .then(function (time) {
            let sm = 0, em = 0;

            sh = time['start'];
            eh = time['end'];

            // Start rule
            let start_rule = new ns.RecurrenceRule();
            start_rule.dayOfWeek = [new ns.Range(0, 6)];
            start_rule.hour = sh;
            start_rule.minute = sm;

            // End rule
            let end_rule = new ns.RecurrenceRule();
            end_rule.dayOfWeek = [new ns.Range(0, 6)];
            end_rule.hour = eh;
            end_rule.minute = em;

            ns.scheduleJob(start_rule, function () {
                ar.start_ariac();
            });

            ns.scheduleJob(end_rule, function () {
                ar.pause_ariac();
            });
        })
        .catch(function (err) {
            let sm = 0, em = 0;

            sh = 0;
            eh = 0;

            // Start rule
            let start_rule = new ns.RecurrenceRule();
            start_rule.dayOfWeek = [new ns.Range(0, 6)];
            start_rule.hour = sh;
            start_rule.minute = sm;

            // End rule
            let end_rule = new ns.RecurrenceRule();
            end_rule.dayOfWeek = [new ns.Range(0, 6)];
            end_rule.hour = eh;
            end_rule.minute = em;

            ns.scheduleJob(start_rule, function () {
                ar.start_ariac();
            });

            ns.scheduleJob(end_rule, function () {
                ar.pause_ariac();
            });
        });

};

