(function() {

  var root = this;
  var previousItem = Item || {};

  var vector = new Two.Vector();

  var Item = root.Item = function(origin, offset) {

    this.origin = origin || new Two.Vector();
    this.offset = offset || new Two.Vector();
    this.visible = false;

    for (var i = 0, l = this.vertices.length; i < l; i++) {
      var v = this.vertices[i];
      v.origin = new Two.Vector().copy(v);
    }

  };

  _.extend(Item, {

    Group: function() {

      Two.Group.apply(this, arguments);
      Item.call(this);

    },

    Polygon: function() {

      Two.Polygon.apply(this, arguments);
      Item.call(this);

    },

    noConflict: function() {
      root.Item = previousItem;
      return Item;
    },

    /**
     * Creates a dummy Item for debugging puproses only.
     */
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

        var shape = new Item.Polygon(points, true, true);
        shape.scale = r;
        shape._radius = r;

        return shape;

      };

    })()

  });

  _.extend(Item.prototype, Two.Polygon.prototype, {

    _radius: 1,

    t: 0,

    camera: null,

    update: function(pct) {

      if (!this.camera) {
        console.warn('No Camera detected.');
        return this;
      }

      var t = TWEEN.Easing.Exponential.In((pct * pct * pct) || 0);

      if (!this.visible) {
        this.visible = true;
      }

      this.scale = this._radius * this.camera.sigmoid(t, this.camera.order);

      this.camera.getPointAt(1 - t, this.translation);
      vector.copy(this.offset).multiplyScalar(t);

      this.translation.x += this.camera.translation._x + vector.x;
      this.translation.y += this.camera.translation._y + vector.y;

      this.t = pct || 0;

      return this;

    }

  });

  _.extend(Item.Group.prototype, Item.prototype, Two.Group.prototype);
  _.extend(Item.Polygon.prototype, Item.prototype, Two.Polygon.prototype);

  Two.Group.MakeObservable(Item.Group.prototype);
  Two.Polygon.MakeObservable(Item.Polygon.prototype);

  function mod(v, l) {
    while (v < 0) {
      v += l;
    }
    return v % l;
  }

})();