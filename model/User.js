/**
 * Created by emalsha on 3/26/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportlocalmongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    fname:String,
    lname:String,
    username:{type:String, required:true, unique:true},
    registrationNumber:String,
    indexNumber:Number,
    email:String,
    role:String,
    created_at:Date,
    updated_at:Date,
    token:String
});

userSchema.plugin(passportlocalmongoose,{hashField:'password'});

module.exports = mongoose.model('User',userSchema);
