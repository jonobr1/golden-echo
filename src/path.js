(function() {

  var vector = new Two.Vector();

  var Path = Two.Path = function(vertices, closed, curved, manual) {

    Two.Polygon.apply(this, arguments);

    this.origin = new Two.Vector();
    this.offset = new Two.Vector();
    this.visible = false;

    for (var i = 0, l = this.vertices.length; i < l; i++) {
      var v = this.vertices[i];
      v.origin = new Two.Vector().copy(v);
    }

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

      var t = TWEEN.Easing.Exponential.In((pct * pct * pct) || 0);
      // var t = pct || 0;

      if (!this.visible) {
        this.visible = true;
      }

      this.scale = this._radius * this.spline.sigmoid(t, this.spline.order);

      this.spline.getPointAt(1 - t, this.translation);
      vector.copy(this.offset).multiplyScalar(t);

      this.translation.x += this.spline.translation._x + vector.x;
      this.translation.y += this.spline.translation._y + vector.y;

      this.t = pct || 0;

      // var dx = this.offset.x - this.origin.x;
      // var dy = this.offset.y - this.origin.y;
      // var theta = Math.atan2(dy, dx);

      // for (var i = 0, l = this.vertices.length; i < l; i++) {
      //   var v = this.vertices[i];
      //   var x = v.x - this.origin.x;
      //   var y = v.y - this.origin.y;
      //   var th = Math.atan2(y, x);
      //   var sh = Math.atan2(v.y, v.x);
      //   var amt = 1 - Math.min(Math.abs(theta - th), 0.9);
      //   v.x = 5 * amt * Math.cos(sh) + v.origin.x;
      //   v.y = 5 * amt * Math.sin(sh) + v.origin.y;
      // }

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