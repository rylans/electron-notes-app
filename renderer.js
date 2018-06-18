// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var {ipcRenderer, remote} = require('electron');

var main = remote.require("./main.js")

window.$ = window.jQuery = require('./jquery.js');

function sendMsg() {
  console.log("clicked");
  //ipcRenderer.send('async', {'event': 'click', 'intent': 'view-data'});
}

function bindClickHandler(id, obj) {
  var item = document.querySelector(id);
  if (item != null) {
    item.addEventListener('click', function() { ipcRenderer.send('async', obj) } );
  }
}

function bindSubmitHandler(id, formid ) {
  var item = document.querySelector(id);
  if (item != null) {
    item.addEventListener('click', function() { 
      ipcRenderer.send('async', {
	'intent': 'submit',
	'content': document.getElementById(formid).value
      });
      $('#' + formid).val(""); 
    });
  }
}

$('#msg').keypress(function(e) {
  if (e.which === 13) {
      ipcRenderer.send('async', {
	'intent': 'submit',
	'content': document.getElementById('msg').value
      });
      $('#msg').val(""); 
    }
});

function setNotes(notes) {
  var htmlbuilder = ''
  for (i=0; i<notes.length; i++){
    htmlbuilder += '<p>' + makeNote(notes[i]) + '</p>'
  }
  $(".note-container").html(htmlbuilder);
}

function makeNote(text) {
  return '<div class="note">' + text + '</div>'
}

ipcRenderer.on('async-reply', (event, arg) => {
  setNotes(arg)
});

//bindClickHandler('#clicker', {'intent': 'view-data'});
//bindClickHandler('#nav-home', {'intent': 'nav-home'});
//bindClickHandler('#nav-quit', {'intent': 'quit'});
bindSubmitHandler('#msg-submit', 'msg')

ipcRenderer.send('async', 'ping');

$("#msg").focus();
