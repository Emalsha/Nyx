/**
 * Created by emalsha on 7/26/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
    file:String,
    owner:[],
});


module.exports = mongoose.model('Owner',ownerSchema);