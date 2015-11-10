var fs = require('fs');

var Dialog = require('dialog');

module.exports = function(mainWindow) {
  var vexEdMenu = {label: 'VexEd', submenu: [
    {
      label: 'About VexEd',
      role: 'about'
    },

    {type: 'separator'},

    {
      label: 'Hide VexEd',
      accelerator: 'CmdOrCtrl+H',
      role: 'hide'
    },
    {
      label: 'Hide Others',
      accelerator: 'CmdOrCtrl+Shift+H',
      role: 'hideothers'
    },
    {
      label: 'Show All',
      role: 'unhide'
    },

    {type: 'separator'},

    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      selector: 'terminate:'
    }
  ]};

  var fileMenu = {label: 'File', submenu: [
    {
      label: 'Open...',
      accelerator: 'CmdOrCtrl+O',
      click: function() { mainWindow.webContents.send('file-open'); }
    },
    {
      label: 'Save',
      accelerator: 'CmdOrCtrl+S',
      click: function() { mainWindow.webContents.send('file-save'); }
    },
    {
      label: 'Save As...',
      accelerator: 'CmdOrCtrl+Shift+S',
      click: function() { mainWindow.webContents.send('file-save-as'); }
    },
    {
      label: 'Export PDF',
      accelerator: 'CmdOrCtrl+E',
      click: function() {
        mainWindow.webContents.printToPDF({}, function(err, data) {
          if (err) {
            Dialog.showErrorBox('Error exporting PDF', err);
          }

          Dialog.showSaveDialog(null, {}, function(filename) {
            if (filename) {
              fs.writeFile(filename, data, function(err) {
                if (err) {
                  Dialog.showErrorBox('Error saving PDF', err);
                }
              });
            }
          });
        });
      }
    }
  ]};

  var editMenu = {label: 'Edit', submenu: [
    {
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    },
    {
      label: 'Redo',
      accelerator: 'CmdOrCtrl+Shift+Z',
      role: 'redo'
    },


    {type: 'separator'},

    {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    },
    {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    },
    {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    },
  ]};

  var viewMenu = {label: 'View', submenu: [
    {
      label: 'Split vertically',
      accelerator: 'CmdOrCtrl+1',
      click: function() {
        mainWindow.webContents.send('split-vert');
      }
    },
    {
      label: 'Split horizontally',
      accelerator: 'CmdOrCtrl+2',
      click: function() {
        mainWindow.webContents.send('split-horiz');
      }
    }
  ]};

  var windowMenu = {label: 'Window', role: 'window', submenu: [
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }
  ]};

  var developMenu = {label: 'Develop', submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function() { mainWindow.reload(); }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: function() { mainWindow.toggleDevTools(); }
    }
  ]};

  var menuTemplate = [
    vexEdMenu,
    fileMenu,
    editMenu,
    viewMenu,
    windowMenu
  ];

  if (process.env.DEVELOP) { menuTemplate.push(developMenu); }

  return menuTemplate;
};
