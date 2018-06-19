// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var {ipcRenderer, remote} = require('electron');

window.$ = window.jQuery = require('./vendor/jquery.js');

function bindSubmitHandler(id, formid ) {
  var item = document.querySelector(id);
  if (item != null) {
    item.addEventListener('click', function() { 
      ipcRenderer.send('async', {
	'intent': 'submit',
	'content': document.getElementById(formid).value
      });
      $('#' + formid).val(""); 
      $("#msg").focus();
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

bindSubmitHandler('#msg-submit', 'msg')

ipcRenderer.send('async', 'ping');

$("#msg").focus();
