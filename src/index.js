const $ = require('jquery')
$( document ).ready(function() {
    console.log( "ready!" );

    $("#submit").click(function(){
      // window.location = "chatroom.html"
      // console.log("Click");
      $.ajax({
        type: "POST",
        url:"http://localhost:5000/chat",
        data:JSON.stringify({
          username:$('#username').val(),
          connection: connectionType
          // address:
        }),
        datatype:"json",
        success: function(data){
          window.location = 'chatroom.html';
        },
        error: function(xhr, textStatus, errorThrown){
          //if failed, then log it
          console.log(errorThrown);
          window.location = "error.html";
        }
      });// End of Ajax call


    });
    // Handle Buttons for Connection Type
    $("#TCP").click((val)=>{
      connectionType = "TCP";
      if($('#TCP').hasClass('btn-primary')){
          $('#TCP').removeClass('btn-primary');
          $('#TCP').addClass('bg-warning');
          $('#UDP').removeClass('bg-warning');
          $('#UDP').addClass('btn-primary');
      }
    });
    $("#UDP").click((val)=>{
      connectionType = "UDP";
      if($('#UDP').hasClass('btn-primary')){
          $('#TCP').removeClass('btn-primary');

          $('#UDP').addClass('bg-warning');
          $('#TCP').removeClass('bg-warning');
          $('#TCP').addClass('btn-primary');
      }
    });

}); // End Document onload
