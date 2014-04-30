(function() {

  var root = this;
  var previousSpark = root.Spark || {};

  var Spark = root.Spark = function(options) {

    var params = _.defaults(options || {}, {
      amount: 3,
      radius: 50,
      startAngle: 0,
      endAngle: Math.PI * 2,
      stroke: 'white'
    });

    this.radius = params.radius;
    this.startAngle = params.startAngle;
    this.endAngle = params.endAngle;
    this.stroke = params.stroke;

    this.translation = new Two.Vector();

    this.shapes = _.map(_.range(params.amount), Spark.createShape, this);

  };

  _.extend(Spark, {

    Properties: [
      'stroke',
      'scale'
    ],

    createShape: function(i) {

      var line = new Two.Polygon([
        new Two.Anchor(),
        new Two.Anchor(0, Math.random() * this.radius)
      ]);

      line.noFill().stroke = this.stroke;
      line.linewidth = 5;
      line.cap = line.join = 'round';

      return line;

    },

    updateShape: function(shape) {
      shape.translation.copy(this.translation);
      shape.rotation = Math.random() * (this.endAngle - this.startAngle) + this.startAngle;
      if (shape.opacity !== this.opacity) {
        shape.opacity = this.opacity;
      }
    }

  });

  _.extend(Spark.prototype, {

    _stroke: 'white',
    _scale: 1,

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