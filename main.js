'use strict';

var app = require('app');
var ipc = require('ipc');

var BrowserWindow = require('browser-window');
var Menu          = require('menu');

var menuTemplate = require('./app/js/menu-template');

var mainWindow = null;
var warnBeforeClose = true;

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    resizable: !!process.env.DEVELOP
  });

  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  var applicationMenu = Menu.buildFromTemplate(menuTemplate(mainWindow));
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
