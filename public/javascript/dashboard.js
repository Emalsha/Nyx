/**
 * Created by emalsha on 4/15/17.
 */

$(document).ready(function(){
    $('#url_info').modal();
    $('#url_tags').material_chip()
});


//    URL form
$('#url_info_form').submit(function () {
//        Get tag values
    let ar = $('#url_tags').material_chip('data');
    let new_array = [];
    for (let i = 0; i < ar.length; i++) {
        new_array.push(ar[i].tag);
    }
    $('#tag_values').val(new_array);

//        Get switch value
    let a = $('#url_availablity_switch').prop('checked');
    $('#availability').val(a);

});

$('#down_link_btn').click(function () {
    let link = $('#down_link').val();

    if (validateUrl(link)) {
        checkUrl(link, (state) => {
                if (state) {
                    $('#url_hi').val(link);
                    $('#url').val(link);
                    $('#url_info').modal('open');

                } else {
                    x0p('Error','URL not exist.','error');
                }
            }
        );

    } else {
        x0p('Error','Please add URL.','error');
    }

});

// Check given url is exist
let checkUrl = (url, cb) => {

    let request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            cb(request.status === 200);
        }
    };

    request.open('GET', url, true);
    request.send();
};


// Validate url
let validateUrl = (url) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
};