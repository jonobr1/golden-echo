(function() {

  var root = this;
  var previousItem = Item || {};

  var vector = new Two.Vector();
  var origin = new Two.Vector();
  var offset = {
    min: new Two.Vector(),
    max: new Two.Vector(),
    center: new Two.Vector()
  };

  var Item = root.Item = function(offset) {

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

    origin: origin,

    noConflict: function() {
      root.Item = previousItem;
      return Item;
    },

    /**
     * Creates a dummy Item for debugging puproses only.
     */
    makeCircle: (function() {

      var amt = 4;

      return function(r) {

        var points = _.map(_.range(amt), function(i) {
          var pct = i / amt;
          var theta = pct * Math.PI * 2;
          var x = r * Math.cos(theta);
          var y = r * Math.sin(theta);
          return new Two.Anchor(x, y);
        });

        var shape = new Item.Polygon(points, true, true);
        // shape.scale = r;
        shape.radius = r;
        shape.curved = Math.random() > 0.5;

        return shape;

      };

    })()

  });

  _.extend(Item.prototype, Two.Polygon.prototype, {

    radius: 1,

    _t: 0,

    t: 0,

    camera: null,

    update: function(pct) {

      if (!this.camera) {
        console.warn('No Camera detected.');
        return this;
      }

      var t = this._t = TWEEN.Easing.Exponential.In((pct * pct * pct) || 0);

      if (!this.visible) {
        this.visible = true;
      }

      var e = t;

      this.scale = this.camera.sigmoid(e, this.camera.order);

      this.camera.getPointAt(1 - t, this.translation);
      vector.copy(this.offset).multiplyScalar(t);

      this.translation.x += this.camera.translation._x + vector.x;
      this.translation.y += this.camera.translation._y + vector.y;

      this.t = pct || 0;

      return this;

    }

  });

  _.extend(Item.Group.prototype, Item.prototype, Two.Group.prototype);
  _.extend(Item.Polygon.prototype, Item.prototype, Two.Polygon.prototype, {

    update: function(pct) {

      Item.prototype.update.call(this, pct);

      return this;

      offset.max.set(-Infinity, -Infinity);
      offset.min.set(Infinity, Infinity);

      // Morph verts based on direction.

      var radius = origin.x * 2;

      for (var i = 0, l = this.vertices.length; i < l; i++) {

        var v = this.vertices[i];
        var dist = vector
          .copy(origin)
          .subSelf(this.translation)
          .distanceTo(v);

        var amt = Math.max(Math.min(dist / radius, 1), 0);

        vector.multiplyScalar(amt).multiplyScalar(this._t);

        v.x = v.origin.x - vector.x;
        v.y = v.origin.y - vector.y;

        offset.max.x = Math.max(v.x, offset.max.x);
        offset.min.x = Math.min(v.x, offset.min.x);
        offset.min.y = Math.min(v.y, offset.min.y);
        offset.max.y = Math.max(v.y, offset.max.y);

      }

      offset.center.set(
        (offset.max.x - offset.min.x) / 2 + offset.min.x,
        (offset.max.y - offset.min.y) / 2 + offset.min.y
      );

      this.translation.subSelf(offset.center);

      return this;

    }

  });

  Two.Group.MakeObservable(Item.Group.prototype);
  Two.Polygon.MakeObservable(Item.Polygon.prototype);

  function mod(v, l) {
    while (v < 0) {
      v += l;
    }
    return v % l;
  }

})();