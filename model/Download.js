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
    availability:String,//public,private TODO
    description:String,
    size:String,
    priority:Number,
    state:String, //pending,approved,rejected,downloaded,downloading,downloadError,deleted
    tags:Array,
    gid:String,
    download_start_date:Date,
    download_end_date:Date,
    file_path:String, // TODO
    hashName:String,
    size_in_byte:Number,
    file_title:String,

});

module.exports = mongoose.model('Download',donwloadSchema);