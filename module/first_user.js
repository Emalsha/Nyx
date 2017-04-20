/**
 * Created by emalsha on 4/20/17.
 */

let debug = require('debug')('nyx:adminCreate');
let User = require('../model/User');

function createAdmin(req, res,done) {

    const username = 'nyxsys';
    const pw = 'qwe';
    User.count({username:username},function(err,count){
       if(count<1){
           let newUser = new User({
               fname:'System',
               lname:'Administrator',
               username:username,
               role:'admin',
               created_at:new Date(),
               updated_at:new Date()
           });

           User.register(newUser,pw,(err,user)=>{
               if(err){
                   debug("Error on admin registration : "+ err) ;
               }
               if(user){
                   debug('New admin registered.');
               }
           })
       }
    });
}

module.exports = createAdmin;