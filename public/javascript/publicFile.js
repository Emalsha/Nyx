/**
 * Created by emalsha on 5/21/17.
 */

$('#search_file').keyup(function () {
    $.ajax({
        url: '/users/search',
        method: 'get',
        dataType: 'json',
        data: {s: encodeURIComponent($('#search_file').val())},
        success: function (data) {
            if (data.length > 0) {

                let collapsible = $('<ul class="collapsible" id="list" data-role="collapsible" data-collapsible="accordion"></ul>');
                let inter = '';
                for (let i = 0; i < data.length; i++) {
                    let obj = data[i];
                    let rdate = new Date(obj['request_date']);
                    let approveDate = new Date(obj['admin_decision_date']);
                    let downDate = new Date(obj['download_start_date']);

                    // Append tags
                    let tags = obj['tags'];
                    let tagdiv = '';
                    if (tags != '') {
                        for (let i = 0; i < tags.length; i++) {
                            tagdiv += '<div class = "chip">' + tags[i] + '</div>';
                        }
                    }

                    inter = $('<li>' +
                        '<div class="collapsible-header">' +
                        '<div class="col s4 truncate">' + obj['link'] + '</div>' +
                        '<div class="col s2">' + obj['size'] + '</div>' +
                        '<div class="col s2">' + rdate.toDateString() + '</div>' +
                        '<div class="col s4 right-align">' +
                        '<input type="button" id="download" value="Download" name="' + obj['link'] + '" class="custom_btn blue white-text">' +
                        '</div>' +
                        '</div>' +

                        '<div class="collapsible-body" >' +
                        '<div class = "row" >' +
                        '<div class = "col s12" >' +
                        '<span class= "subsection_title_sub no_padding" > Download Details </span>' +
                        '</div>' +

                        '<div class= "col s12 l3 truncate contentbox_detail_field" > Download Link </div>' +
                        '<div class="col s12 l9 truncate  contentbox_detail_value" >' + obj['link'] + '</div>' +

                        '<div class="col s12 l3 truncate contentbox_detail_field" > Requested Date </div>' +
                        '<div class="col s12 l9 truncate contentbox_detail_value" >' + rdate.toDateString() + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Approved Date </div >' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + approveDate.toDateString() + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Approved By </div>' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + obj['admin'] + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Started Date </div >' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + downDate.toDateString() + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > MD5 </div>' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + obj['md5'] + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Availability </div>' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + obj['availability'] + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Administrator Notes </div>' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + obj['admin_note'] + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Description </div>' +
                        '<div class = "col s12 l9 truncate  contentbox_detail_value" >' + obj['description'] + '</div>' +

                        '<div class = "col s12 l3 truncate contentbox_detail_field" > Tags </div>' +
                        '< div class = "col s12 l9 truncate  contentbox_detail_value" ' +
                        tagdiv +
                        '</div >' +
                        '</div >' +
                        '</div >' +
                        '</li>');

                    $(collapsible).append(inter);

                }


                $('#result').html($(collapsible).collapsible()).trigger('create');

            } else {
                $('#result').html('<div class="no-content"> No Search Result.</div>');
            }
        }

    })
});


$(document).on('click','#list #download',function () {
    console.log($(this).attr('name'));
});
