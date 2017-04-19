/**
 * Created by emalsha on 4/16/17.
 */
//
// $(document).ready(function(){
//     $.ajax({
//         url:'/download/getall',
//         method:'get',
//         dataType:'json',
//         success:function(data){
//             for(let item in data){
//                 console.log(item);
//                 let html = ejs.render('./element/downloadRequests',item);
//                 $('#downloadRequestCollapse').append(html);
//             }
//         }
//     })
// });

$(document).ready(function() {
    $('s_priority').material_select();
});