var ipc   = require('ipc');
var shell = require('shell');

document.getElementById('version').innerText = ipc.sendSync('app-get-version');

document.getElementById('visit-website').addEventListener('click', function() {
  shell.openExternal('https://github.com/kostia/VexEd');
}, false);
