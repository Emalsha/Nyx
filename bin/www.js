#!/usr/bin/env node
// const numCPU = require('os').cpus().length;
// let debugw = require('debug')('nyx:worker');

const debug = require('debug')('nyx:server');
const debugd = require('debug')('nyx:database');
const debuga = require('debug')('nyx:aria2c');
const http = require('http');
const cluster =require('cluster');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const app = require('../app');
const tm = require('../module/task_manager');
const aria2 = require('../module/aria2c_config').aria2obj;

const first_user = require('../module/first_user');


const port = normalizePort(process.env.PORT || '3000');
let server;


// var dburl = "mongodb://emalsha:ucsc_sample_db@ds131890.mlab.com:31890/ucsc_sample";
let dburl = "mongodb://localhost:27017/project_nyx";


server = http.createServer(app);
var io = require('socket.io').listen(server);
var cglobals = require("../module/custom_globals");

mongoose.connect(dburl,(err) => {
    if(err){
        debugd('Unable to connect Database.');
        process.exit(1);
    }
});

let db = mongoose.connection;
db.on('open',function(){
    debugd('Database connected.');
    createServer();
    first_user();
    checkAriaServer();
    taskManager();
});


function createServer() {

    // if (cluster.isMaster) {
    //     debug(`Master ${process.pid} is running`);
    //
    //     // Fork works
    //     for (let i = 0; i < numCPU; i++) {
    //         cluster.fork();
    //     }
    //
    //     cluster.on('exit', (worker, code, signal) => {
    //         debugw(`Worker ${worker.process.pid} died.`);
    //     });
    // } else {

    app.set('port', port);


    server.listen(port);

    server.on('error', onError);
    server.on('listening', onListening);


    // debugw(`Worker ${process.pid} start`);
    // }
}


function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;


    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}


//Socket Configurations

var NetStat = require('../module/netstat');
var netstat = new NetStat(io);

io.on('connection', function(socket){
    console.log('connection initialized',socket.id,socket.request.connection.remoteAddress.replace(/^.*:/, ''));
    socket.on('disconnect', function () {
        console.log(socket.id,"disconnected");
    });

    socket.on('AuthId', function(data) {
        try {
            var newuser = JSON.parse(data);
            console.log(data);
            cglobals.onlineUsers.push(newuser);
            io.emit('user_connect',data);
        }catch (e){
            //
        }

    });
    // io.emit('user_connect','{"name": "'+ +'","uname": "heysulo"}');

});




function taskManager() {
    tm.setTimer();
}
function checkAriaServer() {
    aria2.getVersion(function (err, res) {
        if (err) {
            debuga('Server not running...');
        } else {
            debuga('aria2c running on port 6800');
        }
    })
}
