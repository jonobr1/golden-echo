(function() {

  var root = this;
  var previousItem = Item || {};

  var delta = new Two.Vector();
  var origin = new Two.Vector();

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

      var amt = 6;

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
      delta.copy(this.offset).multiplyScalar(e);

      this.translation.x += this.camera.translation._x + delta.x;
      this.translation.y += this.camera.translation._y + delta.y;

      this.t = pct || 0;

      return this;

    }

  });

  _.extend(Item.Group.prototype, Item.prototype, Two.Group.prototype);
  _.extend(Item.Polygon.prototype, Item.prototype, Two.Polygon.prototype, {

    update: function(pct) {

      Item.prototype.update.call(this, pct);

      delta.copy(this.translation).subSelf(origin).normalize();

      // // Morph verts based on direction.

      // for (var i = 0, l = this.vertices.length; i < l; i++) {

      //   var v = this.vertices[i];
      //   var dist = v.origin.distanceTo(delta);
      //   var amp = dist / 4;

      //   var x = delta.x * amp;
      //   var y = delta.y * amp;

      //   v.x = v.origin.x - x;
      //   v.y = v.origin.y - y;

      // }

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