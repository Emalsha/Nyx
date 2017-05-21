/**
 * Created by emalsha on 5/21/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSchema = new Schema({
    start:Number,
    end:Number,
    edit_by:String,
    edit_date:Date
});

module.exports = mongoose.model('Time',timeSchema);