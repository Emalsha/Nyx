/**
 * Created by emalsha on 5/18/17.
 */

const spawn = require('child_process').spawn;

ariac = spawn('aria2c', ['--enable-rpc', '--rpc-listen-all=true', '--rpc-allow-origin-all', '--rpc-secret=ucscaria', '--log=' + __dirname + '/../aria2c.log']);

// debuga('aria2c running on port 6800');

ariac.stdout.on('data', data => {
    console.log( `stdout: ${data}` );
});

ariac.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
});

ariac.on('close', code => {
    console.log(`child process exited with code ${code}`);
});

// function runAriaServer() {
//
//     aria2.getVersion(function (err, res) {
//         if (err) {
//             ariac = spawn('aria2c', ['--enable-rpc', '--rpc-listen-all=true', '--rpc-allow-origin-all', '--rpc-secret=ucscaria', '--log=' + __dirname + '/../aria2c.log']);
//
//             debuga('aria2c running on port 6800');
//
//             ariac.stdout.on('data', data => {
//                 console.log( `stdout: ${data}` );
//             });
//
//             ariac.stderr.on('data', data => {
//                 console.log(`stderr: ${data}`);
//             });
//
//             ariac.on('close', code => {
//                 console.log(`child process exited with code ${code}`);
//             });
//         }
//     })
// }