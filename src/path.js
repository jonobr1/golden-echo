(function() {

  var vector = new Two.Vector();

  var Path = Two.Path = function(vertices, closed, curved, manual) {

    Two.Polygon.apply(this, arguments);

    this.origin = new Two.Vector();
    this.visible = false;

  };

  _.extend(Path, {

    makeCircle: (function() {

      var amt = 6;

      var points = _.map(_.range(amt), function(i) {
        var pct = i / amt;
        var theta = pct * Math.PI * 2;
        var x = Math.cos(theta);
        var y = Math.sin(theta);
        return new Two.Anchor(x, y);
      });

      return function(r) {

        var shape = new Path(points, true, true);
        shape.scale = r;
        shape._radius = r;

        return shape;

      };

    })()

  });

  _.extend(Path.prototype, Two.Polygon.prototype, {

    _radius: 1,

    t: 0,

    update: function(pct) {

      if (!this.spline) {
        return this;
      }

      var t = pct || 0;

      if (!this.visible) {
        this.visible = true;
      }

      this.scale = this._radius * this.spline.sigmoid(t, this.spline.order);
      // this.opacity = 1 - t;

      this.spline.getPointAt(1 - t, this.translation);
      vector.copy(this.origin).multiplyScalar(t);

      this.translation.x += this.spline.translation._x + vector.x;
      this.translation.y += this.spline.translation._y + vector.y;

      this.t = mod(t, 1);

      return this;

    }

  });

  Two.Polygon.MakeObservable(Path.prototype);

  function mod(v, l) {
    while (v < 0) {
      v += l;
    }
    return v % l;
  }

})();