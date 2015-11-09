var fs     = require('fs');
var ipc    = require('ipc');
var remote = require('remote');

var Dialog = remote.require('dialog');

var ui = {
  input: document.getElementById('input'),
  output: document.getElementById('output'),
  error: document.getElementById('error')
};

var state = (function() {
  var currentWindow = remote.getCurrentWindow();

  var that = {
    setPersisted: function(filename, data) {
      that.persisted = true;
      that.filename = filename;
      that.data = data;
      currentWindow.setTitle(`VexEd - ${filename}`);
    },

    setNotPersisted: function() {
      that.persisted = false;

      if (that.filename) {
        currentWindow.setTitle(`VexEd - ${that.filename}*`);
      } else {
        currentWindow.setTitle(`VexEd - *`);
      }
    }
  };

  return that;
}());

var vextab = require('./js/vextab')(ui.input, ui.output, ui.error);

ui.input.addEventListener('input', function() {
  if (input.innerText !== state.data) { state.setNotPersisted(); }
  vextab.render();
});

ipc.on('file-open', function() {
  Dialog.showOpenDialog(null, {}, function(filenames) {
    if (filenames) {
      var filename = filenames[0];
      fs.readFile(filename, 'utf8', function(err, data) {
        if (err) { return Dialog.showErrorBox(`Error opening ${filename}`, err); }
        state.setPersisted(filename, data);
        ui.input.innerText = data;
        vextab.render();
      });
    }
  });
});

ipc.on('file-save', function() {
  var data = ui.input.innerText;
  if (state.filename) {
    saveFile(state.filename, data);
  } else {
    Dialog.showSaveDialog(null, {}, function(filename) {
      saveFile(filename, data);
    });
  }
});

var saveFile = function(filename, data) {
  fs.writeFile(filename, data, function(err) {
    if (err) { return Dialog.showErrorBox(`Error saving ${filename}`, err); }
    state.setPersisted(filename, data);
  });
};

vextab.render();
