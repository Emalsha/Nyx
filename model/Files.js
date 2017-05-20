/**
 * Created by emalsha on 4/15/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename:String,
    path:String,
    availability:String,
    request_user:String,
    description:String,
    size:String,
    tags:Array,

});

module.exports = mongoose.model('Files',fileSchema);
