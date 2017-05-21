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
    $('select').material_select();
});