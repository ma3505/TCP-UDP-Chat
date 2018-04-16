const $ = require('jquery');
const dgram = require('dgram');
const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow;
const net = require('net');


// Connection Info
var SERVER_IP;
var CLIENT;
var PORT;
var USER;
var CONNECTION_TYPE="";
let ERR_MSG="";

$( document ).ready(()=>{
    console.log( "ready!" );

    $("#submit").click(()=>{
      // setup socket connection
      // window.location = "chatroom.html"
      SERVER_IP = $("#serverip").val();
      PORT = $("#port").val();
      USER = $("#username").val();
      // Choose Connection  socket Type
      if(CONNECTION_TYPE ==  "TCP"){
        try{
          CLIENT = net.connect(PORT,SERVER_IP,()=>{
              console.log("connected to server");
               // Load in the chatroom template - this is necessary since
               // web socket do not persist when reloading the webpage
              $(".container").load("chatroom.html",()=>{

                // HANDLE EVENT FOR RECIEVING TCP DATA
                CLIENT.on('data',(data)=>{
                  console.log(data.toString());
                  //parse and push message to chatbot
                });


                // HANDLE EVENT FOR SENDING TCP DATA
                $("#send-msg").click(()=>{
                  var msg_body = $("#input-msg-box").val();
                  CLIENT.write(String(msg_body));
                });



              });
            });
        }catch(err){
          console.log(err);
        }


      }else if(CONNECTION_TYPE == "UDP"){
        console.log("NOT YET SUPPORTED");
      }else{
          // Erros are handled here
          const modalPath = path.join('file://',__dirname,'error.html');
          let err_win = new BrowserWindow({width:400, height:100})
          err_win.on('close', function() {err_win = null })
          err_win.loadURL(modalPath)
          err_win.show()
      }


    });


    // Handle Buttons for Connection Type
    $("#TCP").click((val)=>{
      CONNECTION_TYPE = "TCP";
      if($('#TCP').hasClass('btn-primary')){
          $('#TCP').removeClass('btn-primary');
          $('#TCP').addClass('bg-warning');
          $('#UDP').removeClass('bg-warning');
          $('#UDP').addClass('btn-primary');
      }
    });
    $("#UDP").click((val)=>{
      CONNECTION_TYPE = "UDP";
      if($('#UDP').hasClass('btn-primary')){
          $('#TCP').removeClass('btn-primary');

          $('#UDP').addClass('bg-warning');
          $('#TCP').removeClass('bg-warning');
          $('#TCP').addClass('btn-primary');
      }
    });

}); // End Document onload
