// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const fs = require('fs')
const path = require('path')
const noteDelim = '-----38291-note-delim----'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow(
    { title: 'SuperApp',
      width: 400, 
      height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('listing.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//

function switchWindow(page) {
  mainWindow.loadFile(page)
}

function writeNote(content) {
  var p = path.join(app.getPath('userData'), '_notes.txt')
  var toWrite = content + '\n' + noteDelim + '\n'
  fs.appendFileSync(p, toWrite, function (err) {
    if (err) throw err;

  });
  
}

function getNotes() {
  var p = path.join(app.getPath('userData'), '_notes.txt');
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
  return filteredNotes

}

ipcMain.on('async', (event, arg) => {

  if ('view-data' === arg.intent) {
    switchWindow('listing.html')
  } else if ('nav-home' === arg.intent) {
    switchWindow('index.html')
  } else if ('quit' === arg.intent) {
    app.quit()
  } else if ('submit' === arg.intent) {
    writeNote(arg.content.trim())
  } else {
    //console.log(arg)
  }
  var notes = getNotes()
  event.sender.send('async-reply', notes)

});
