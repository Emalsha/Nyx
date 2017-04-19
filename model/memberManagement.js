// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const config = require('../DBconfig/database'); // conneting to the database
//
// //User schema
// const UserSchema = mongoose.Schema({
// 	email :{
// 		type : String,
// 		required : true
// 	},
// 	username :{
// 		type :String,
// 		required : true
// 	},
// 	password  : {
// 		type :String,
// 		required : true
// 	}
//
// });
//
// const User = module.exports = mongoose.model('User', UserSchema);
//
// module.exports.getUserById = function(id, callback){
// 	User.findById(id , callback);
// }
//
// module.exports.getUserByUsername = function(username, callback){
// 	const query = {username : username}
// 	User.findOne(query,callback);
// }
//
// module.exports.addUser = function(newUser, callback){
// 	bcrypt.genSalt(10, (err, salt) => {
// 		bcrypt.hash(newUser.password, salt , (err, hash) => {
// 			//if(err) throw er;
// 			newUser.password = hash;
// 			newUser.save(callback);
// 		});
// 	});
// }
//
// module.exports.comparePassword = function(password, hash , callback){
// 	bcrypt.compare(password, hash , (err , isMatch) => {
// 		//if(err) throw err;
// 		callback(null,isMatch);
// 	});
// }
