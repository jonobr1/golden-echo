(function() {

  var root = this;
  var previousTimpani = root.Timpani || {};

  var Timpani = root.Timpani = function() {

    Item.Object3D.call(this);

    this.add(Timpani.Lines.clone());
    for (var i = 0; i < Timpani.Spheres.length; i++) {
      this.add(Timpani.Spheres[i].clone());
    }

  };

  Timpani.Offset = 75;

  var amt = 6;

  Timpani.Material = new THREE.MeshBasicMaterial({ color: 0x333333 });
  Timpani.Lines = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({
    color: 0x333333
  }));

  Timpani.Lines.geometry.vertices = _.map(_.range(amt + 1), function(i) {
    var pct = i / amt;
    var theta = Math.PI * 2 * pct;
    var x = Timpani.Offset * Math.cos(theta);
    var y = Timpani.Offset * Math.sin(theta);
    return new THREE.Vector3(x, y, 0);
  });

  Timpani.Spheres = _.map(Timpani.Lines.geometry.vertices, function(v) {
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(1), Timpani.Material);
    mesh.position.copy(v);
    return mesh;
  });

  Timpani.prototype = Object.create(Item.Object3D.prototype);

  _.extend(Timpani.prototype, {

    start: function(origin, direction) {

      if (this.enabled) {
        return this;
      }

      Item.prototype.start.call(this, origin, direction);

      return this;

    },

    update: function(t) {

      var s = t;

      this.scale.set(s, s, s);
      return this;

    }

  });

})();