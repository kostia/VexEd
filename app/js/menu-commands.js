var fs  = require('fs');
var ipc = require('ipc');

var Dialog = require('dialog');

module.exports = {
  openFile: function(mainWindow) {
    Dialog.showOpenDialog(mainWindow, {
      title: 'Open a Vex File',
      filters: [
        {name: 'Vex Files', extensions: ['vex']},
        {name: 'All Files', extensions: ['*']}
      ]
    }, function(filenames) {
      if (filenames) {
        var filename = filenames[0];
        fs.readFile(filename, 'utf8', function(err, data) {
          if (err) { return Dialog.showErrorBox(`Error loading ${filename}`, err); }
          mainWindow.webContents.send('load-data', data);
          mainWindow.setTitle(`VexEd - ${filename}`);
        });
      }
    });
  }
};
