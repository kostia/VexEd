module.exports = function(input, output, error, editor) {
  var renderer = new Vex.Flow.Renderer(output, Vex.Flow.Renderer.Backends.CANVAS);

  return {
    render: function() {
      var artist = new Artist(10, 10, $(input).width() - 30);
      var vextab = new VexTab(artist);

      try {
        vextab.reset();
        artist.reset();
        vextab.parse(editor.getValue());
        artist.render(renderer);
        error.innerText = '';
        $(error).hide();
      } catch (e) {
        console.log(e);
        error.innerText = 'Error: ' + e.message.replace(/[\n]/g, '<br/>');
        $(error).show();
      }
    }
  };
};
