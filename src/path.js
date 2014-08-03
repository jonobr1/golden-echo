(function() {

  var root = this;
  var previousPath = root.Path || {};

  var Superclass = THREE.Spline, vector = new THREE.Vector3();

  var Path = root.Path = function(camera) {

    camera.velocity = camera.velocity || 0;

    var points = [];
    for (var i = 0; i < Path.Resolution; i++) {
      var x = camera.position.x;
      var y = camera.position.y;
      var z = camera.position.z + (Path.Resolution - i - 1) * camera.velocity;
      points.push(new THREE.Vector3(x, y, z));
    }

    Superclass.call(this, points);

    this.camera = camera;

  };

  Path.Resolution = 500;

  // Path.constructor = new Path();
  Path.prototype = Object.create(Superclass.prototype);

  Path.prototype.k = 0;

  Path.prototype.update = function() {

    // Don't update if we're not moving.
    if (this.camera.velocity <= 0) {
      return this;
    }

    var step = this.camera.velocity / this.camera.far;
    this.k += step;

    vector.copy(this.getPoint(1 - this.k));

    this.camera.lookAt(vector);
    this.camera.position.copy(vector);

    var index = Math.floor(this.k * this.points.length);

    if (index < 1) {
      return this;
    }

    var i, l;
    var points = this.points.splice(this.points.length - (index + 1), index + 1);

    // TODO: Should we make this vector additive? (Would make more spirals)
    vector.set(0, 0, this.camera.velocity).applyEuler(this.camera.influence);

    for (i = l = points.length - 1, count = 1; i >= 0; i--) {

      var p = points[i];

      if (i >= l) {
        p.copy(this.points[0]);
      } else {
        p.copy(points[i + 1]);
      }

      p.add(vector);

      count++;

    }

    this.points = points.concat(this.points);

    this.k = 0;

    return this;

  };

})();