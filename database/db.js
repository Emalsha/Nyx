/**
 * Created by emalsha on 3/18/17.
 */

let mongoClient = require('mongodb').MongoClient;
// var dburl = "mongodb://emalsha:ucsc_sample_db@ds131890.mlab.com:31890/ucsc_sample";
let dburl = "mongodb://localhost:27017/project_nyx";
let debug = require('debug')('nyx:database');

let state = {
    db : null,
};

exports.connect = function (done) {
    if(state.db){
        return done();
    }

    mongoClient.connect(dburl,function (err, db) {
        if (err) {
            return done(err);
        }else{
            state.db = db;
            debug("Connection establish...");
            done();
        }
    })
};

exports.get = function () {
    return state.db;
};

exports.close = function (done) {
    if(state.db){
        state.db.close(function (err, result) {
            state.db = null;
            state.mode = null;
            done(err);
        })
    }
};
