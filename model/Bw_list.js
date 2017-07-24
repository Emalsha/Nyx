/**
 * Created by emalsha on 4/15/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bw_listSchema = new Schema({
    domain:String,
    hits:Number,
    list_type:String,

});

module.exports = mongoose.model('Bw_list',bw_listSchema);
