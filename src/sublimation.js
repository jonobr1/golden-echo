(function() {

  var root = this;
  var previousSublimation = root.Sublimation || {};

  var Sublimation = root.Sublimation = function(options) {

    var params = _.defaults(options || {}, {
      duration: this.duration,
      colorA: 'white',
      colorB: 'black',
      easing: TWEEN.Easing.Circular.InOut
    });

    this.duration = params.duration;
    this.easing = params.easing;

    this.shapes = {
      a: new Two.Polygon(Sublimation.Vertices, true),
      b: new Two.Polygon(Sublimation.Vertices, true)
    };

    this.shapes.a.noStroke().fill = params.colorA;
    this.shapes.b.noStroke().fill = params.colorB;

    this.foreground = new Two.Group().add(this.shapes.a);
    this.background = new Two.Group().add(this.shapes.b);
    this.group = new Two.Group().add(this.background, this.foreground);

    this.active = 'a';

    this.shapes.a.scale = 0;
    this.shapes.b.scale = 2000;

    this.shapes.a.tween = new TWEEN.Tween(this.shapes.a)
      .to({ scale: 2000 }, this.duration)
      .easing(this.easing)
      .onComplete(_.bind(function() {
        this.shapes.b.scale = 0;
        this.background.add(this.shapes.a);
        this.foreground.add(this.shapes.b);  // Change z-index
        this.active = 'b';
        this.playing = false;
        this.shapes.a.tween.stop();
      }, this));

    this.shapes.b.tween = new TWEEN.Tween(this.shapes.b)
      .to({ scale: 2000 }, this.duration)
      .easing(this.easing)
      .onComplete(_.bind(function() {
        this.shapes.a.scale = 0;
        this.foreground.add(this.shapes.a);
        this.background.add(this.shapes.b);  // Change z-index
        this.active = 'a';
        this.playing = false;
        this.shapes.b.tween.stop();
      }, this));

  };

  _.extend(Sublimation, {

    Vertices: [
      new Two.Anchor(-1, -1),
      new Two.Anchor(1, -1),
      new Two.Anchor(1, 1),
      new Two.Anchor(-1, 1)
    ]

  });

  _.extend(Sublimation.prototype, {

    active: 'a',

    playing: false,

    duration: 1000,

    addTo: function(parent) {
      parent.add(this.group);
      return this;
    },

    setTimeline: function(timeline) {
      this.shapes.a.tween.parent(timeline);
      this.shapes.b.tween.parent(timeline);
      return this;
    },

    start: function() {
      if (this.playing) {
        return this;
      }
      this.shapes[this.active].tween.start();
      this.playing = true;
      return this;
    }

  });

})();