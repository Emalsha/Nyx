/**
 * Created by emalsha on 4/15/17.
 */

$('#down_link_btn').click(function(){
    let link = $('#down_link').val();

    $.ajax({
        url:'/download/request',
        dataType:'json',
        data:{
            link:link
        },
        method:'POST',
        success:function(res){
            if(res.data){
                alert('New download request added...');
            }

        }
    })
});
