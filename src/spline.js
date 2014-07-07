(function() {

  var root = this;

  var Spline = Two.Spline = function(width, height, order) {

    this.order = order || 4;

    Two.Polygon.call(this, _.map(_.range(Spline.Resolution), function(i) {
      var pct = i / (Spline.Resolution - 1);
      var adj = this.sigmoid(pct);
      var x = 0;
      var y = - adj * height;
      return new Two.Anchor(x, y);
    }, this));

    this.noFill();

    this.rect = {};
    this.curved = true;
    this.resize(width, height);

  };

  Spline.Resolution = 16;

  _.extend(Spline.prototype, Two.Polygon.prototype, {

    /**
     * Delineates origin for transformations
     */
    resize: function(width, height) {

      this.rect.width = width;
      this.rect.left = - width / 2;
      this.rect.right = width / 2;

      this.rect.height = height;
      this.rect.top = - height;
      this.rect.bottom = 0;

      return this;

    },

    /**
     * Turn a certain amount by [-1, 1] via altering the distribution
     * of Spline's vertices.
     */
    turn: function(t) {

      var reach = this.rect.width / 2;

      for (var i = 0, l = this.vertices.length; i < l; i++) {

        var pct = i / (l - 1);
        var v = this.vertices[i];
        v.x = reach * t * pct;

      }

      return this;

    },

    sigmoid: function(t) {
      var r = 1 / (1 + Math.exp(- this.order * t));
      return 2 * (r - 0.5);
    }

  });

  Two.Polygon.MakeObservable(Spline.prototype);

})();