var fs    = require('fs');
var shell = require('shell');

var Dialog = require('dialog');

module.exports = function(mainWindow, app) {
  var vexEdMenu = {label: 'VexEd', submenu: [
    {
      label: 'About VexEd',
      role: 'about'
    },

    {
      label: 'Check For Update...',
      click: function() {
        var gh_releases = require('electron-gh-releases');

        var options = {
          repo: 'kostia/VexEd',
          currentVersion: 'v0.0.2'//app.getVersion()
        };

        var update = new gh_releases(options, function (auto_updater) {
          console.log('checking...');
          // Auto updater event listener
          auto_updater.on('update-downloaded', function (e, rNotes, rName, rDate, uUrl, quitAndUpdate) {
            // Install the update
            quitAndUpdate();
          });
        });

        // Check for updates
        update.check(function (err, status) {
          console.log(err);
          console.log(status);

          if (!err && status) {
            update.download();
          }
        });
      }
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
      label: 'Export Notation As PDF',
      accelerator: 'CmdOrCtrl+E',
      click: function() { mainWindow.webContents.send('file-save-as-pdf'); }
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
        mainWindow.webContents.send('view-switch-vert');
      }
    },
    {
      label: 'Split horizontally',
      accelerator: 'CmdOrCtrl+2',
      click: function() {
        mainWindow.webContents.send('view-switch-horiz');
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

  var helpMenu = {label: 'Help', role: 'help', submenu: [
    {
      label: 'VexTab Reference',
      click: function() { shell.openExternal('http://www.vexflow.com/vextab'); }
    },
    {
      label: 'VexEd Support',
      click: function() { shell.openExternal('https://github.com/kostia/VexEd'); }
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
    windowMenu,
    helpMenu
  ];

  if (process.env.DEVELOP) { menuTemplate.push(developMenu); }

  return menuTemplate;
};
