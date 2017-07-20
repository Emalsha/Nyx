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

const cast = require('../module/globalutils');
cast.log("Starting system.")


const port = normalizePort(process.env.PORT || '3000');
let server;

//Globals
cast.log("Initializing system components.")
global.loggedinusers = [];
global.activesessions = [];
global.onlineadmins = [];
global.onlineusers = [];
global.connectedsockets = [];



// var dburl = "mongodb://emalsha:ucsc_sample_db@ds131890.mlab.com:31890/ucsc_sample";
let dburl = "mongodb://localhost:27017/project_nyx";


server = http.createServer(app);
var io = require('socket.io').listen(server);

mongoose.connect(dburl,(err) => {
    if(err){
        debugd('Unable to connect Database.');
        cast.log("Database Connection Failure.");
        process.exit(1);
    }else {
        cast.log("Database connection success.");
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
    // var user_xname = global.connectedsockets[socket.id];
    // cast.log('Socket initialized from ' + user_xname + "("+ socket.request.connection.remoteAddress.replace(/^.*:/, '') + ") ID:" + socket.id);

    socket.on('ping',function (data) {

        var username = global.activesessions[data.token];
        if (username === undefined){
            io.to(socket.id).emit("refresh","refresh_token");
            cast.log("Issuing page refresh command to socket ID:" + socket.id + " REASON : User not found in active sessions",1);
        }else{
            
            global.connectedsockets[socket.id] = username;
            cast.log("Socket of " + username + " Authenticated from " + socket.request.connection.remoteAddress.replace(/^.*:/, ''),5);
        }

    });

    socket.on('disconnect', function () {
        var username = global.connectedsockets[socket.id];
        if (username !== undefined){
            if (global.loggedinusers[username] !== undefined && global.loggedinusers[username][3].indexOf(socket.id) !== -1){
                delete global.loggedinusers[username][3].splice(global.loggedinusers[username][3].indexOf(socket.id),1);
            }
            if (global.connectedsockets[socket.id] !== undefined){
                delete global.connectedsockets[socket.id];
            }
            if (global.loggedinusers.indexOf([username]) !== -1 && global.loggedinusers[username][1] === "admin"){
                if (global.onlineadmins.indexOf(username) !== -1){
                    global.onlineadmins.splice(global.onlineadmins.indexOf(username),1);
                }
            }
            if (global.onlineusers.indexOf(username) !== -1){
                global.onlineusers.splice(global.onlineusers.indexOf(username),1);
            }
            cast.log("Socket of " + username + " disconnected. ID:"+socket.id);
        }

    });

    socket.on('usr-auth', function (data) {
        var username = global.activesessions[data.token];
        if (username === undefined){
            io.to(socket.id).emit("refresh","refresh_token");
            cast.log("Issuing page refresh command to socket ID:" + socket.id + " REASON : User not found in active sessions",1);
        }else{
            if (global.loggedinusers[username][1] === "admin"){
                if (global.onlineadmins.indexOf(username) === -1){
                    cast.log("Administrator " + username + " connected from " + socket.request.connection.remoteAddress.replace(/^.*:/, ''),5);
                    global.onlineadmins.push(username);
                }
            }
            if (global.onlineusers.indexOf(username) === -1){
                cast.log("User " + username + " Authenticated from " + socket.request.connection.remoteAddress.replace(/^.*:/, ''),5);
                global.onlineusers.push(username);
            }
            if (global.loggedinusers.indexOf(username) === -1){
                if (global.loggedinusers[username][3].indexOf(socket.id) === -1){
                    global.loggedinusers[username][3].push(socket.id);
                }
            }
            global.connectedsockets[socket.id] = username;
            io.to(socket.id).emit("usr-auth-success","success");
            cast.log("Socket of " + username + " Authenticated from " + socket.request.connection.remoteAddress.replace(/^.*:/, ''),5);
        }
    });

    socket.on('sysping',function (data) {
        var username = global.activesessions[data.token];
        if (username === undefined){
            io.to(socket.id).emit("loginconfirm-error-uid","loginconfirm_token");
            cast.log("Issuing page loginconfirm-error-uid command to socket ID:" + socket.id + " REASON : User not found in active sessions",2);
        }else {
            // cast.log("Ping recieced",6);
        }
    });

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
