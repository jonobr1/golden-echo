(function() {

  var root = this;
  var previousTomahawk = root.Tomahawk || {};
  var TEMP = new Two.Vector();

  var Tomahawk = root.Tomahawk = function(two, options) {

    var params = _.defaults(options || {}, {

    });

    this.two = two;
    this.ready(_.bind(Tomahawk.createShape, this));

    this.translation = new Two.Vector();

  };

  _.extend(Tomahawk, {

    queue: [],

    createShape: function(svg) {

      this.shape = this.two.interpret(svg);

      _.each(this.shape.children, function(child) {
        var rect = child.getBoundingClientRect(true);
        child.center();
        child.translation.addSelf(TEMP.set(rect.left + rect.width / 2, rect.top + rect.height / 2));
      });

      this.shape.center();

      _.each(this.shape.children, function(child) {
        child.origin = new Two.Vector().copy(child.translation);
        child.destination = new Two.Vector().copy(child.translation);
      });

    }

  });

  _.extend(Tomahawk.prototype, {

    rotation: 0,

    scale: 1,

    exploding: false,

    drag: 0.33,

    addTo: function(parent) {
      parent.add(this.shape);
      return this;
    },

    ready: function(f) {

      if (Tomahawk.svg) {
        f(Tomahawk.svg);
        return this;
      }

      Tomahawk.queue.push(f);
      return this;

    },

    update: function() {

      this.shape.translation.copy(this.translation);

      if (this.shape.rotation !== this.rotation) {
        this.shape.rotation = this.rotation;
      }

      if (this.shape.scale !== this.scale) {
        this.shape.scale = this.scale;
      }

      // if (!this.exploding) {
      //   return this;
      // }

      var exploded = false;

      for (var i in this.shape.children) {
        var child = this.shape.children[i];
        if (child.translation.equals(child.destination)) {
          exploded = true;
          break;
        }
        child.translation.addSelf(
          TEMP
            .copy(child.destination)
            .subSelf(child.translation)
            .multiplyScalar(this.drag)
        );
        child.opacity += (child.destination.opacity - child.opacity) * this.drag;
      }

      if (exploded) {
        this.reset();
      }

      return this;

    },

    explode: function(impact, amplitude) {

      var x = impact.x - this.translation.x;
      var y = impact.y - this.translation.y;

      for (var i in this.shape.children) {

        var child = this.shape.children[i];
        var theta = Math.atan2(child.translation.y - y, child.translation.x - x);
        var distance = Math.max(amplitude / child.origin.distanceTo(TEMP.set(x, y)), 0);

        child.destination.copy(child.origin).addSelf(
          TEMP.set(
            amplitude * Math.cos(theta) * distance,
            amplitude * Math.sin(theta) * distance
          )
        );
        child.destination.opacity = Math.pow(distance, - 12);

      }

      // this.exploding = true;
      return this;

    },

    reset: function() {

      for (var i in this.shape.children) {
        var child = this.shape.children[i];
        // child.translation.copy(child.origin);
        child.destination.copy(child.origin);
        child.destination.opacity = 1;
      }

      return this;

    }

  });

  $(function() {

    $.get('./assets/shapes/tomahawk.svg', function(resp) {

      Tomahawk.svg = $(resp).find('svg')[0];
      _.each(Tomahawk.queue, function(f) {
        f(Tomahawk.svg);
      });

      Tomahawk.queue.length = 0;

    });

  });

})();