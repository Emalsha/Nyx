/**
 * Created by sulochana on 5/20/17.
 */
var socket = io.connect('localhost:3000');
console.log('Connected to Server Socket : ', socket.connected);

socket.on('connect',function(){
    // Send ehlo event right after connect:
    //socket.emit('AuthId', JSON.stringify(globaluser));
});


socket.on('disconnect', function () {
    document.getElementById('dc_panel').style.display="block";
    console.log('you have been disconnected');
});

socket.on('reconnect', function () {
    document.getElementById('dc_panel').style.display="none";
    console.log('reconnected');
});