const fs = require('fs')
const path = require('path')
const noteDelim = '-----38291-note-delim----'
const notesfile = '_notes.txt'

function writeNote(content, userDataFolder) {
  var p = path.join(userDataFolder, notesfile)
  var toWrite = content + '\n' + noteDelim + '\n'
  fs.appendFileSync(p, toWrite, function (err) {
    if (err) throw err;
  });
}

function getNotes(userDataFolder) {
  var p = path.join(userDataFolder, notesfile)
  try {
    var allnotes = fs.readFileSync(p, 'utf8');
  } catch (err) {
      return []
  }
  var listOfNotes = allnotes.split( '\n' + noteDelim + '\n');

  var filteredNotes = [];
  for (i=0; i< listOfNotes.length; i++) {
    var trimmed = listOfNotes[i].trim()
    if (trimmed.length > 0) {
      filteredNotes.push(trimmed)
    }
  }
  filteredNotes.reverse()
  return filteredNotes

}

exports.writeNote = writeNote;
exports.getNotes = getNotes;
