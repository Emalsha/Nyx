/**
 * Created by emalsha on 3/18/17.
 */

var bcrypt = require('bcrypt');
var database = require('../database/db');
var Q = require('q');


// Register new user
exports.localReg = function (username, password) {

    var defer = Q.defer();

    database.get().collection('user').findOne({'username':username})
        .then(function (result) {
            if(null != null){
                console.log("User already exist");
                defer.resolve(false);
            }else{
                const saltRound = 10;
                bcrypt.hash(password,saltRound,function (err, hash) {
                    var newUser = {
                        'username':username,
                        'password':hash
                    };
                    database.get().collection('user').save(newUser,function (err, result) {
                        if(err){
                            defer.resolve(false);
                        }else{
                            console.log('New user registered : '+username);
                            defer.resolve(newUser);
                        }
                    });
                });
            }
        });
    return defer.promise;
};

// Check user credentials
exports.localAuth = function (username, password) {
    var defer = Q.defer();
    database.get().collection('user').findOne({'username':username})
        .then(function (result) {
            if (null == result){
                console.log('No user found');
                defer.resolve(false);
            }else{
                var hash = result.password;
                bcrypt.compare(password,hash,function (err, res) {
                    if(res){
                        defer.resolve(result);
                    }else{
                        console.log('Authentication fail');
                        defer.resolve(false);
                    }
                });
            }
        });
    return defer.promise;
};