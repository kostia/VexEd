var BrowserWindow = require('browser-window');

var cheatsheetWindow;

module.exports = function(app) {
  if (!cheatsheetWindow) {
    cheatsheetWindow = new BrowserWindow({width: 900, height: 700, resizable: true});
    cheatsheetWindow.loadUrl('file://' + __dirname + '/../../cheatsheet-renderer.html');
    cheatsheetWindow.on('close', function() { cheatsheetWindow = null; });
  }
};
