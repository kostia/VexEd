var _ = require('lodash');
var ipc = require('ipc');

var renderer = new Vex.Flow.Renderer(document.getElementById('output'), Vex.Flow.Renderer.Backends.CANVAS);
var artist = new Artist(10, 10, 600, {scale: 0.8});
var vextab = new VexTab(artist);

var render = function() {
  try {
    vextab.reset();
    artist.reset();
    vextab.parse(document.getElementById('input').innerText);
    artist.render(renderer);
    document.getElementById('error').innerText = '';
  } catch (e) {
    console.log(e);
    document.getElementById('error').innerText = e.message.replace(/[\n]/g, '<br/>');
  }
};

document.getElementById('input').addEventListener('input', function() {
  render();
});

ipc.on('load-data', function(data) {
  document.getElementById('input').innerText = data;
});

render();
