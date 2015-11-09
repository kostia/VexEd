'use strict';

var app = require('app');

var BrowserWindow = require('browser-window');
var Menu          = require('menu');

var menuTemplate = require('./app/js/menu-template');

var mainWindow = null;

app.on('ready', function() {
  mainWindow = new BrowserWindow({});
  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

  var applicationMenu = Menu.buildFromTemplate(menuTemplate(mainWindow));
  Menu.setApplicationMenu(applicationMenu);
});
