(function() {

  var root = this;
  var previousSpark = root.Spark || {};

  var Spark = root.Spark = function(options) {

    var params = _.defaults(options || {}, {
      amount: 3,
      radius: 50,
      startAngle: 0,
      endAngle: Math.PI * 2,
      linewidth: 5,
      stroke: 'white',
      duration: 250
    });

    this.radius = params.radius;
    this.startAngle = params.startAngle;
    this.endAngle = params.endAngle;
    this.stroke = params.stroke;
    this.linewidth = params.linewidth;

    this.timeline = params.timeline;
    this.duration = params.duration;

    this.translation = new Two.Vector();

    this.shapes = _.map(_.range(params.amount), Spark.createShape, this);

  };

  _.extend(Spark, {

    Properties: [
      'stroke',
      'scale',
      'visible'
    ],

    createShape: function(i) {

      // TODO: Create more sparkline-like shape... clockwise winding.

      var line = new Two.Polygon([
        new Two.Anchor(),
        new Two.Anchor(0, Math.random() * this.radius)
      ]).subdivide();

      line.automatic = true;

      line.noFill().stroke = this.stroke;
      line.linewidth = this.linewidth * Math.random() + 1;
      line.cap = line.join = 'round';

      line.playing = false;

      line.reset = _.bind(function() {

        line.beginning = 0;
        line.ending = 0;

        line.rotation = Math.random() * (this.endAngle - this.startAngle) + this.startAngle;

        line.t1.stop();
        line.t2.stop();

        if (!line.playing) {
          return;
        }

        line.t1.start();
        line.t2.start();

      }, this);

      var randomness = Math.random();

      line.t1 = new TWEEN.Tween(line)
        .parent(this.timeline)
        .to({ ending: 1 }, this.duration * randomness)
        .easing(TWEEN.Easing.Sinusoidal.Out);

      line.t2 = new TWEEN.Tween(line)
        .parent(this.timeline)
        .to({ beginning: 1 }, this.duration * Math.random())
        .delay(this.duration * randomness)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .onComplete(line.reset);

      line.reset();

      return line;

    },

    updateShape: function(shape) {
      shape.translation.copy(this.translation);
      if (shape.opacity !== this.opacity) {
        shape.opacity = this.opacity;
      }
    }

  });

  _.extend(Spark.prototype, {

    _stroke: 'white',
    _scale: 1,
    _visible: true,

    rotation: 0,

    opacity: 1,

    amount: 5,

    radius: 50,

    startAngle: 0,

    endAngle: Math.PI * 2,

    addTo: function(parent) {
      if (parent.scene instanceof Two.Group) {
        parent.scene.add(this.shapes);
        return this;
      }
      parent.add(this.shapes);
      return this;
    },

    update: function() {

      _.each(this.shapes, Spark.updateShape, this);

      return this;

    },

    start: function() {

      _.each(this.shapes, function(line) {
        line.playing = true;
        line.reset();
      });

      return this;

    },

    stop: function() {

      _.each(this.shapes, function(line) {
        line.playing = false;
      });

      return this;

    }

  });

  _.each(Spark.Properties, function(k) {
    var secret = '_' + k;
    Object.defineProperty(Spark.prototype, k, {
      get: function() {
        return this[secret];
      },
      set: function(v) {
        _.each(this.shapes, function(shape) {
          shape[k] = v;
        });
        this[secret] = v;
      }
    });
  });

})();