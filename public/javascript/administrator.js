/**
 * Created by emalsha on 4/16/17.
 */


$(document).ready(function () {

    $.ajax({
        url:'/admin/server_time',
        method:'get',
        dataType:'json',
        success:function (data) {
            $('#start_time').val(data['start']);
            $('#end_time').val(data['end']);
        }
    })
});

$('#set_time').click(function () {
    let start = $('#start_time').val();
    let end = $('#end_time').val();

    if(start === "" || end === "") {
        x0p('Error', 'Please select valid time range', 'error');
    }else{
        $.ajax({
            url: '/admin/server',
            dataType: 'json',
            method: 'post',
            data: {
                start: start,
                end: end,
            },
            success: function (res) {
                if (res === true) {
                    x0p('Done', 'Server up time set.', 'ok');
                } else {
                    x0p('Error', 'Server time set fail.', 'error');
                }
            }
        })
    }
});
