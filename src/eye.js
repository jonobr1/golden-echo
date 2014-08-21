/**
 * An eye.
 * @author jonobr1 / http://jonobr1.com
 */
(function() {

  var root = this;
  var previousEye = root.Eye || {};

  var Eye = root.Eye = function(width, height, color) {

    var two = this.two = new Two({
      type: Two.Types.canvas,
      width: width,
      height: height,
      ratio: 2
    });

    var ball = two.makeGroup();
    var eye = two.makeGroup();

    var retina = two.makeCircle(0, 0, two.height / 4);
    retina.fill = color;
    retina.noStroke();

    var pupil = two.makeCircle(0, 0, two.height / 6);
    pupil.fill = '#333';
    pupil.linewidth = width * 10 / 400;
    pupil.noStroke();
    var reflection = two.makeCircle(two.height / 12, - two.height / 12, two.height / 12)
    reflection.fill = 'rgba(255, 255, 255, 0.9)';
    reflection.noStroke();

    Two.Resolution = 32;

    var lid = this.lid = two.makeEllipse(0, 0, two.height / 3, two.height / 4);
    lid.stroke = '#333';
    lid.curved = false;
    lid.linewidth = width * 20 / 400;
    lid.join = 'round';
    lid.noFill();

    var mask = two.makeEllipse(0, 0, two.height / 4, two.height / 4);

    ball.add(retina, pupil, reflection);
    ball.destination = new Two.Vector();
    ball.dest = new Two.Vector();
    var ballContainer = two.makeGroup(ball);
    ballContainer.mask = mask;

    eye.add(ballContainer, lid);
    eye.translation.set(two.width / 2, two.height / 2);

    this.shape = eye;

    _.each(lid.vertices, function(v) {
      v.origin = new Two.Vector().copy(v);
      v.dest = new Two.Vector().copy(v);
    });

    var releaseEye = _.debounce(function() {
      ball.dest.clear();
    }, 750);

    two.bind('update', function() {

      for (var i = 0, l = lid.vertices.length; i < l; i++) {
        var v = lid.vertices[i];
        v.x += (v.dest.x - v.x) * 0.4;
        v.y += (v.dest.y - v.y) * 0.4;
        mask.vertices[i].copy(v);
      }

      ball.translation.x += (ball.dest.x - ball.translation.x) * 0.0625;
      ball.translation.y += (ball.dest.y - ball.translation.y) * 0.0625;

    });

    this._open = _.bind(this.open, this);
    this._watch = _.bind(function(e) {

      e.preventDefault();
      var x = e.clientX, y = e.clientY;

      if (e.changedTouches && e.changedTouches.length > 0) {
        x = e.changedTouches[0].pageX;
        y = e.changedTouches[0].pageY;
      }

      var mouse = new Two.Vector(x, y);
      var rect = two.renderer.domElement.getBoundingClientRect();
      var center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      var theta = Math.atan2(mouse.y - center.y, mouse.x - center.x);
      var distance = mouse.distanceTo(center);
      var pct = distance / window.innerWidth;
      var radius = two.height / 4 * pct;
      ball.dest.set(radius * Math.cos(theta), radius * Math.sin(theta));

      releaseEye();

      return false;
    }, this);

  };

  _.extend(Eye.prototype, {

    appendTo: function(elem) {
      elem.appendChild(this.two.renderer.domElement);
      return this;
    },

    watch: function() {
      window.addEventListener('touchstart', this._watch, false);
      window.addEventListener('mousemove', this._watch, false);
      window.addEventListener('touchmove', this._watch, false);
      return this;
    },

    blink: function(callback) {

      this.close();
      _.delay(this._open, 150);
      if (_.isFunction(callback)) {
        _.delay(_.bind(callback, this), 300);
      }
      return this;

    },

    close: function() {
      _.each(this.lid.vertices, function(v) {
        v.dest.y = 0;
      });
      return this;
    },

    open: function() {
      _.each(this.lid.vertices, function(v) {
        v.dest.y = v.origin.y;
      });
      return this;
    }

  });

})();