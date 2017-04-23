/**
 * Created by emalsha on 4/15/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donwloadSchema = new Schema({
    link:String,
    request_date:Date,
    request_user:String,
    admin_decision:Boolean,
    admin_decision_date:Date,
    admin:String,
    admin_note:String,
    reject_note:String,
    md5:String,
    availability:String,
    description:String,
    priority:Number,
    state:String,
    tags:Array,

});

module.exports = mongoose.model('Download',donwloadSchema);