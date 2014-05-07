(function() {

  var root = this;
  var previousHammer = root.Hammer || {};

  var Hammer = root.Hammer = function(width, height, radius, amount) {

    var top = - height / 2;
    var left = radius - width / 2;
    var right = left + width;
    var bottom = height / 2;

    this.shape = new Two.Polygon([
      new Two.Anchor(left, top),
      new Two.Anchor(right, top),
      new Two.Anchor(right, bottom),
      new Two.Anchor(left, bottom)
    ], true);

    this.shape.noStroke();

    this.radius = radius;
    this.duration = 750;
    this.destination = {
      rotation: Math.random() > 0.5 ? 0 : - Math.PI,
      opacity: 1
    };

    this.explosion = _.map(_.range(amount || (Math.floor(6 * Math.random()) + 6)), function(i) {

      var circle = new Two.Polygon(Hammer.CircleVertices, true, true);

      circle.fill = 'rgba(255, 255, 255, 0.33)';
      circle.stroke = 'white';
      circle.linewidth = width / 12;

      circle.scale = Math.random() * width / 8 + width / 8;
      circle.destination = { x: 0, y: 0 };
      circle.tween = new TWEEN.Tween(circle.translation)
        .easing(TWEEN.Easing.Circular.Out)
        .onStart(function() {
          circle.visible = true;
        })
        .onUpdate(function(t) {
          circle.opacity = Math.sqrt(1 - t);
        });

      return circle;

    }, this);

    this.fadeOut = new TWEEN.Tween(this.shape)
      .to({ opacity: 0 }, this.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out);

    this.tween = new TWEEN.Tween(this.shape)
      .easing(TWEEN.Easing.Elastic.Out)
      .onComplete(_.bind(function() {
        this.fadeOut.start();
      }, this));

    this.reset();

  };

  Hammer.CircleVertices = _.map(_.range(Two.Resolution), function(i) {
    var pct = i / Two.Resolution;
    var theta = Math.PI * 2 * pct;
    var x = Math.cos(theta);
    var y = Math.sin(theta);
    return new Two.Anchor(x, y);
  });

  _.extend(Hammer.prototype, {

    addTo: function(parent) {

      parent
        .add(this.shape)
        .add(this.explosion);

      return this;

    },

    setTimeline: function(timeline) {

      this.tween.parent(timeline);
      this.fadeOut.parent(timeline);

      for (var i = 0, l = this.explosion.length; i < l; i++) {
        this.explosion[i].tween.parent(timeline);
      }

      return this;

    },

    reset: function() {

      this.shape.rotation = Math.random() * Math.PI * 2;
      this.destination.rotation = this.shape.rotation + (Math.random() > 0.5 ? Math.PI / 2 : - Math.PI / 2);
      this.shape.opacity = 0;

      var x = this.radius * Math.cos(this.destination.rotation) + this.shape.translation.x;
      var y = this.radius * Math.sin(this.destination.rotation) + this.shape.translation.y;

      for (var i = 0, l = this.explosion.length; i < l; i++) {

        var circle = this.explosion[i];
        var theta = Math.random() * Math.PI * 2;
        var radius = Math.random() * 200;

        circle.visible = false;
        circle.translation.set(x, y);

        circle.destination.x = radius * Math.cos(theta) + x;
        circle.destination.y = radius * Math.sin(theta) + y;

        circle.tween
          .to(circle.destination, this.duration / 2)
          .delay(this.duration * 0.25);

      }

      return this;

    },

    start: function() {
      this.reset();
      this.tween
        .to(this.destination, this.duration)
        .start();
      for (var i = 0, l = this.explosion.length; i < l; i++) {
        var circle = this.explosion[i];
        circle.tween.start();
      }
      return this;
    }

  });

})();