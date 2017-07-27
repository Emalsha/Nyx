/**
 * Created by emalsha on 7/26/17.
 */

let fs = require('fs');
let crypto = require('crypto');

fs.createReadStream('./acl_fn.js').pipe(crypto.createHash('sha1').setEncoding('hex')).on('finish', function () {
    console.log(this.read()) //the hash
});