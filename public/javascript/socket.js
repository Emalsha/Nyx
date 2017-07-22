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

var authenticated = false;
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

socket.on('usr-auth-success',function (data) {
    authenticated = true;
    console.log("Authentication success!");
});

socket.on('refresh',function (data) {
    console.log("refresh");
    location.reload();
});

socket.on('loginconfirm-error-uid',function (data) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj;
            try {
                obj = JSON.parse(this.responseText);
                if (obj.status === "success"){
                    console.log("SYSPING : NO_UID. LOGIN:1. LOGGING OUT USER");
                    location.replace("/logout");
                }else{
                    if (authenticated == false){
                        console.log("SYSPING : UNLOGGED USER. SYSPING DISABLED");
                        clearInterval(SYSPING);
                    }else {
                        console.log("SYSPING : UNLOGGED USER. REDIRECTING");
                        location.replace("/");
                    }
                }
            } catch (e) {
                location.reload();
            }
        }
    };
    xhttp.open("GET", "/loginstatus", true);
    xhttp.send();
});

socket.on('kok',function () {
   console.log("sdsdsd");
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

//pingpong service
var SYSPING = setInterval(function () {
    var token_data = getCookie("id_token");
    if (token_data !== ""){
        socket.emit('sysping', { token:token_data });
    }else{
        console.log("SYSPING : NO_UID. CHECKING LOGIN STATUS");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var obj;
                try {
                    obj = JSON.parse(this.responseText);
                    if (obj.status === "success"){
                        console.log("SYSPING : NO_UID. LOGIN:1. LOGGING OUT USER");
                        location.replace("/logout");
                    }else{
                        if (authenticated == false){
                            console.log("SYSPING : UNLOGGED USER. SYSPING DISABLED");
                            clearInterval(SYSPING);
                        }else {
                            console.log("SYSPING : UNLOGGED USER. REDIRECTING");
                            location.replace("/");
                        }
                    }
                } catch (e) {
                    location.reload();
                }
            }
        };
        xhttp.open("GET", "/loginstatus", true);
        xhttp.send();
    }
},1000);
