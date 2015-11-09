'use strict';

var app = require('app');
var ipc = require('ipc');

var BrowserWindow = require('browser-window');
var Menu          = require('menu');

var menuTemplate = require('./app/js/menu-template');

var mainWindow = null;
var warnBeforeClose = true;

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  var applicationMenu = Menu.buildFromTemplate(menuTemplate(mainWindow));
  Menu.setApplicationMenu(applicationMenu);

  mainWindow.on('close', function(e) {
    if (warnBeforeClose) {
      e.preventDefault();
      mainWindow.webContents.send('will-close');
    }
  });
});

ipc.on('quit', function() {
  warnBeforeClose = false;
  app.quit();
});
