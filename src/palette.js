(function() {

  var root = this;
  var previousPalette = root.palette || {};

  var palette = root.palette = {

    list: [
      {
        background: { r: 60, g: 100, b: 100 },
        solid: { r: 50, g: 0, b: 10 },
        light: { r: 250, g: 230, b: 110 },
        accent: { r: 255, g: 255, b: 200 }
      },
      {
        background: { r: 47, g: 45, b: 60 },
        solid: { r: 100, g: 100, b: 100 },
        light: { r: 0, g: 0, b: 0 },
        accent: { r: 150, g: 150, b: 150 }
      },
      {
        background: { r: 170, g: 160, b: 150 },
        solid: { r: 255, g: 75, b: 75 },
        light: { r: 100, g: 200, b: 200 },
        accent: { r: 0, g: 0, b: 0 }
      },
      {
        background: { r: 0, g: 25, b: 175 },
        solid: { r: 0, g: 255, b: 215 },
        light: { r: 255, g: 255, b: 255 },
        accent: { r: 175, g: 25, b: 0 }
      }
    ],

    index: 1,

    prev: function() {
      return palette.set(palette.index - 1);
    },

    next: function() {
      return palette.set(palette.index + 1);
    },

    set: function(v) {
      palette.index = mod(v, palette.list.length);
      palette.active = palette.list[palette.index];
      return palette.active;
    },

    toString: function(k) {
      var v = palette.active[k];
      return 'rgb(' +
        v.r + ',' +
        v.g + ',' +
        v.b + ')';
    }

  };

  palette.set(palette.index);

  function mod(v, l) {
    while (v < 0) {
      v += l;
    }
    return v % l;
  }

})();