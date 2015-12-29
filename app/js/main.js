'use strict';

var app = require('app');
var ipc = require('ipc');

var BrowserWindow = require('browser-window');
var Menu          = require('menu');

var menuTemplate = require('./main/menu-template');
var showCheatsheet = require('./main/show-cheatsheet');

var mainWindow = null;
var warnBeforeClose = true;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    'min-width': 500,
    'min-height': 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  mainWindow.loadUrl('file://' + __dirname + '/../editor-renderer.html');

  app.mainWindow = mainWindow;

  var applicationMenu = Menu.buildFromTemplate(menuTemplate(app));
  Menu.setApplicationMenu(applicationMenu);

  if (process.env.TOOLS) {
    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.toggleDevTools();
    });
  }

  mainWindow.on('close', function(e) {
    if (warnBeforeClose) {
      e.preventDefault();
      mainWindow.webContents.send('window-close');
    }
  });
});

ipc.on('app-quit', function() {
  warnBeforeClose = false;
  app.quit();
});

ipc.on('app-get-version', function(event) {
  event.returnValue = app.getVersion();
});

ipc.on('help-show-cheatsheet', function() {
  showCheatsheet(app);
});

