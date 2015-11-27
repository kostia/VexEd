var fs    = require('fs');
var shell = require('shell');

var BrowserWindow = require('browser-window');
var Dialog        = require('dialog');

var showCheatsheet = require('./show-cheatsheet');

var aboutWindow;

module.exports = function(app) {
  var vexEdMenu = {label: 'VexEd', submenu: []};

  if (process.platform === 'darwin') {
    vexEdMenu.submenu.push({
      label: 'About VexEd',
      role: 'about'
    });
  } else {
    vexEdMenu.submenu.push({
      label: 'About VexEd',
      click: function() {
        if (!aboutWindow) {
          aboutWindow = new BrowserWindow({width: 250, height: 100, resizable: true});
          aboutWindow.loadUrl('file://' + __dirname + '/../../about-renderer.html');
          aboutWindow.on('close', function() { aboutWindow = null; });
        }
      }
    });
  }

  vexEdMenu.submenu = vexEdMenu.submenu.concat([
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
  ]);

  var fileMenu = {label: 'File', submenu: [
    {
      label: 'Open...',
      accelerator: 'CmdOrCtrl+O',
      click: function() { app.mainWindow.webContents.send('file-open'); }
    },
    {
      label: 'Save',
      accelerator: 'CmdOrCtrl+S',
      click: function() { app.mainWindow.webContents.send('file-save'); }
    },
    {
      label: 'Save As...',
      accelerator: 'CmdOrCtrl+Shift+S',
      click: function() { app.mainWindow.webContents.send('file-save-as'); }
    },
    {
      label: 'Export Notation As PDF',
      accelerator: 'CmdOrCtrl+E',
      click: function() { app.mainWindow.webContents.send('file-save-as-pdf'); }
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
        app.mainWindow.webContents.send('view-switch-vert');
      }
    },
    {
      label: 'Split horizontally',
      accelerator: 'CmdOrCtrl+2',
      click: function() {
        app.mainWindow.webContents.send('view-switch-horiz');
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
      label: 'VexTab Cheatsheet',
      accelerator: 'CmdOrCtrl+I',
      click: function() { showCheatsheet(app); }
    },
    {
      label: 'About VexTab',
      click: function() { shell.openExternal('http://www.vexflow.com/vextab'); }
    },
    {
      label: 'VexEd Website',
      click: function() { shell.openExternal('https://github.com/kostia/VexEd'); }
    }
  ]};

  var developMenu = {label: 'Develop', submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: function() { app.mainWindow.reload(); }
    },
    {
      label: 'Toggle DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: function() { app.mainWindow.toggleDevTools(); }
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
