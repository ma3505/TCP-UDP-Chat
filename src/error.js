/*
   File for handling any Errors that is thrown  by the UI
   Mesasages are passed from the applications main index.js file
*/
const $ = require('jquery');
const electron = require('electron');
const remote = electron.remote
const ipc = require('electron').ipcRenderer;
const closeBtn = document.getElementById('closeBtn')

ipc.on('message', (event, message) => {
    console.log(message); // logs out "Hello second window!"
    $("#notify").text(message);
})

closeBtn.addEventListener('click', function (event) {
    var window = remote.getCurrentWindow();
    window.close();
})
