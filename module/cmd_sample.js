/**
 * Created by emalsha on 3/19/17.
 */

var exec = require('child_process').exec;

exec('ifconfig',function (err, stdout, stderr) {
    console.log(stdout);
})

