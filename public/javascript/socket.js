/**
 * Created by sulochana on 5/20/17.
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var socket = io.connect('localhost:3000');
console.log('Connected to Server Socket : ', socket.connected);

socket.on('connect',function(){
    // Send ehlo event right after connect:
    //socket.emit('AuthId', JSON.stringify(globaluser));
    io_connnection = true;
    var token_data = getCookie("id_token");
    if (token_data !== ""){
        socket.emit('usr-auth', { token:token_data });
    }
});


socket.on('refresh',function (data) {
    location.reload();
});



socket.on('disconnect', function () {
    if (io_connnection == true){
        document.getElementById('dc_panel').style.display="block";
        console.log('you have been disconnected');
    }
});

socket.on('reconnect', function () {
    document.getElementById('dc_panel').style.display="none";
    console.log('reconnected');
});