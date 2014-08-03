(function() {

  var root = this;
  var previousSnare = Snare || {};

  var Superclass = THREE.Mesh, zero = new THREE.Vector3(),
    vector = new THREE.Vector3();

  var Snare = root.Snare = function() {

    var scope = this;

    var geometry = Snare.Geometry;
    var material = Snare.Material.clone();

    Superclass.call(this, geometry, material);

    this.tween = new TWEEN.Tween(this)
      .onComplete(function() {
        scope.tween.stop();
        scope.visible = false;
      });
    this.offset = new THREE.Vector3();

    this.reset();

  };

  Snare.Geometry = new THREE.BoxGeometry(1, 1, 1);
  Snare.Material = new THREE.MeshBasicMaterial({
    color: 0x9999ff
  });

  Snare.prototype = Object.create(Superclass.prototype);

  Snare.prototype.duration = 0;

  Snare.prototype.start = function(origin, direction) {

    if (this.visible) {
      return this;
    }

    vector.copy(this.offset).applyEuler(direction);

    this.position.copy(origin).add(vector);
    this.rotation.copy(direction);

    this.visible = true;

    this.tween.to({}, this.duration).start();

    return this;

  };

  Snare.prototype.update = function() {

    if (!this.visible) {
      return this;
    }

    return this;

  };

  Snare.prototype.reset = function() {

    // this.rotation.set(
    //   Math.PI * 2 * Math.random(),
    //   Math.PI * 2 * Math.random(),
    //   Math.PI * 2 * Math.random()
    // );

    this.scale.set(
      25,
      1,
      1
    );

    this.offset.set(
      // 50 * (Math.random() - 0.5),
      // 50 * (Math.random()),
      0,
      - 10,
      0
    );

    this.visible = false;

    return this;

  };

})();