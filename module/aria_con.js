/**
 * Created by emalsha on 3/10/17.
 */

const Aria2 = require('aria2');

let option = {
    secure:true,
    host:'localhost',
    port:6800,
    secret:'ucscaria',
    path:'jsonrpc'
                };

const aria2 = new Aria2(option);

console.log(aria2);

aria2.getVersion(function (err, res) {
    console.log(err || res);
});