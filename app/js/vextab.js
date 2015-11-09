module.exports = function(input, output, error) {
  var renderer = new Vex.Flow.Renderer(output, Vex.Flow.Renderer.Backends.CANVAS);

  return {
    render: function() {
      var artist = new Artist(10, 10, $(input).width());
      var vextab = new VexTab(artist);

      try {
        vextab.reset();
        artist.reset();
        vextab.parse(input.innerText);
        artist.render(renderer);
        error.innerText = '';
      } catch (e) {
        console.log(e);
        error.innerText = e.message.replace(/[\n]/g, '<br/>');
      }
    }
  };
};
