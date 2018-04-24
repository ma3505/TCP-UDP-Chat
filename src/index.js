const $ = require('jquery');
const ip = require('ip');
const dgram = require('dgram');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const net = require('net');
const path = require('path');
// Connection Info
var SERVER_IP;
var CLIENT;
var PORT;
var USER;
var CONNECTION_TYPE = "";
let ERR_MSG="";

$( document ).ready(()=>{
    $("#submit").click(()=>{
      // setup socket connection
      SERVER_IP = String($("#serverip").val()).trim();
      PORT = $("#port").val();
      USER = $("#username").val();
      // Choose Connection  socket Type
      if(CONNECTION_TYPE ==  "TCP" && validate()){
        try{
          CLIENT = net.connect(PORT,SERVER_IP,()=>{
              console.log("connected to server");
                // Send username to server
                CLIENT.write("<<<USERNAME:"+USER+">>>");
               // Load in the chatroom template - this is necessary since
               // web socket do not persist when reloading the webpage
              $(".container").load("chatroom.html",()=>{

                // OUTPUT SUCCESS IN placeholder of message box
                $("#message-output").attr("placeholder","Now contacting Server "
                  + SERVER_IP + " with " + CONNECTION_TYPE + " from " + ip.address()
                );
                // HANDLE EVENT FOR RECIEVING TCP DATA
                CLIENT.on('data',(data)=>{
                  var results = new Array();
                  var data = data.toString();

                  // Format Response into a result set
                  data_arry = data.split(/<<<|>>>/);
                  results.push(data_arry[1]);
                  results.push(data_arry[3]);
                  //parse and push message to chatbot
                  push_message(data);

                });
                // HANDLE EVENT FOR SENDING TCP DATA
                $("#send-msg").click(()=>{
                  var msg_body = $("#input-msg-box").val();
                  encoded_msg = encode_message(msg_body);
                  CLIENT.write(String(encoded_msg));
                });
              });
            });
        }catch(err){
          console.log(err);
        }

      }else if(CONNECTION_TYPE == "UDP"){
        // Send Request to server to hit the UDP server endpoint
        try{

          MESSAGE= new Buffer("<<<USERNAME:"+USER+">>>");
          UDP_SERVER = dgram.createSocket('udp4');
          // SEND INITIAL CONNECTION MESSAGE
          UDP_SERVER.send(MESSAGE, 0, MESSAGE.length, PORT, SERVER_IP, function(err, bytes) {
              console.log('UDP Connected to ' + SERVER_IP +':'+ PORT);
          });
          // Render Chat Box and begin UDP listening
          $(".container").load("chatroom.html",()=>{

            // OUTPUT connection details in  placeholder of message box
            $("#message-output").attr("placeholder","Now contacting Server "
              + SERVER_IP + " with " + CONNECTION_TYPE + " from " + ip.address()
            );
            // Handle recieving new UDP mesages
            UDP_SERVER.on("message",(msg,info) => {
              // Output messsage to chat box
              push_message(msg);
            });

            // HANDLE EVENT FOR SENDING UDP DATA
            $("#send-msg").click(()=>{
              var msg_body = $("#input-msg-box").val();
              encoded_msg = encode_message(msg_body);
              UDP_SERVER.send(encoded_msg, 0, encoded_msg.length, PORT, SERVER_IP, function(err, bytes) {
                  console.log('UDP Message' + encoded_msg);
              });
            });
          });
        }catch(err){
          console.log(err);
        }
      } else {
        validate();
        openError(ERR_MSG);
      }
    });

    // Push to Chatbox
    push_message = (msg) =>{
      var txt = $("#message-output");
      txt.val( txt.val() + "\n"+msg.toString()+"\n");
      $("#input-msg-box").val("");

    };

    // Validate all Inputs have
    var validate = () => {
      if(CONNECTION_TYPE == ""){
        ERR_MSG = "No Connection Type Specified";
        return false;
      }else if ($("#username").val() == "") {
        ERR_MSG = "No Username Specified";
        return false;
      }else if ($("#serverip").val() == "") {
        ERR_MSG = "No IP Specified";
        return false;
      }else if ($("#port").val() == "") {
        ERR_MSG = "No port Specified";
        return false;
      }else {
        return true;
      }
    };

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
// Handle Enter Key submit
$("#input-msg-box").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#send-msg").click(()=>{
          console.log("ENTER CLICKED");
        });
    }
});


}); // End Document onload

encode_message = (msg) =>{
  del_msg = "<<<USERNAME:"+USER+">>><<<MSG:"+msg+">>>"
  return del_msg;
}

openError = (err) =>{
  // Erros are handled here
  const modalPath = path.join('file://',__dirname,'error.html');
  let err_win = new BrowserWindow({width:400, height:150});
  err_win.on('close', function() {err_win = null });
  err_win.loadURL(modalPath);
  err_win.show();
  err_win.webContents.on('did-finish-load', ()=>{
    // Pass error to second window
    err_win.send('message',err);
  })
}
