/**
 * Created by sulochana on 5/9/17.
 */
$(document).ready(function(){
    //run call on ready functions.
    for (i = 0; i < call_on_load.length; i++) {
        window[call_on_load[i]]();
    }
});

$(document).ready(function() {
    $('.modal').modal();
    $('select').material_select();

    if (status_socket !== undefined){
        var i;
        for (i=0;i<gid_lst.length;i++){
            status_socket.emit('getstatus',{gid:gid_lst[i]})
        }
    }

});



function openloader(msg,head) {
    var title = document.getElementById("ajaxbox_title");
    var desc = document.getElementById("ajaxbox_desc");
    if (typeof head !== "undefined"){
        title.innerHTML = head;
    }else{
        title.innerHTML = "Waiting for Server";
    }
    if (typeof msg !== "undefined"){
        desc.innerHTML = msg;
    }else{
        desc.innerHTML = "";
    }
    $('#ajaxloader').modal('open');
}

function closeloader() {
    $('#ajaxloader').modal('close');
}