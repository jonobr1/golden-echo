(function() {

  var root = this;
  var previousBass = root.Bass || {};

  var vector = new THREE.Vector3();
  var resolution = 32;
  var radius = 30;
  var shape = new THREE.Shape(_.map(_.range(resolution), function(i) {
    var pct = i / resolution;
    var theta = Math.PI * 2 * pct;
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);
    return new THREE.Vector2(x, y);
  }));

  var Bass = root.Bass = function() {

    Item.call(this);

  };

  Bass.Offset = 200;

  Bass.prototype = Object.create(Item.prototype);

  _.extend(Bass.prototype, {

    Geometry: shape.makeGeometry(),

    Material: new THREE.MeshBasicMaterial({
      color: 'purple',
      transparent: true,
      side: THREE.DoubleSide
    }),

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      var s = this.t * 5;
      this.scale.set(s, s, s);

      // vector.set(- Math.PI / 2, 0, 0).applyEuler(direction);

      // this.rotation.x += vector.x;
      // this.rotation.y += vector.y;
      // this.rotation.z += vector.z;

      this.rotation.x += Math.PI / 2;
      this.rotation.y = this.rotation.z = 0;

      this.position.y -= 10;

      return this;

    },

    reset: function() {

      this.stop();

      this.offset.x = (Math.random() - 0.5) * Bass.Offset;

      return this;

    }

  });

})();