(function() {

  var root = this;
  var previousTimpani = root.Timpani || {};

  var Timpani = root.Timpani = function() {

    Item.Object3D.call(this);

    this.add(new THREE.Line(Timpani.Geometry, Timpani.LineMaterial));
    for (var i = 0; i < amt; i++) {
      var mesh = new THREE.Mesh(Timpani.SphereGeometry, Timpani.Material);
      mesh.position.copy(Timpani.Geometry.vertices[i]);
      this.add(mesh);
    }

  };

  Timpani.distinction = 8;
  Timpani.Offset = 500;

  var amt = 6;

  Timpani.Material = new THREE.MeshBasicMaterial({ color: 0x333333 });
  Timpani.LineMaterial = new THREE.LineBasicMaterial();
  Timpani.LineMaterial.color = Timpani.Material.color;
  Timpani.LineMaterial.needsUpdate = true;

  Timpani.Geometry = new THREE.Geometry();
  Timpani.SphereGeometry = new THREE[THREE.SphereBufferGeometry ? 'SphereBufferGeometry' : 'SphereGeometry'](5);
  Timpani.Geometry.vertices = _.map(_.range(amt + 1), function(i) {
    var pct = i / amt;
    var theta = Math.PI * 2 * pct;
    var x = Timpani.Offset * Math.cos(theta);
    var y = Timpani.Offset * Math.sin(theta);
    return new THREE.Vector3(x, y, 0);
  });

  Timpani.colorDuration = 1000;
  Timpani.changeColor = (function() {

    var tween = new TWEEN.Tween(Timpani.Material.color)
      .onUpdate(function() {
        Timpani.Material.needsUpdate = true;
        Timpani.LineMaterial.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Timpani.colorDuration)
      tween.start();
    };

  })();
  Timpani.setColor = function(color) {
    Timpani.Material.color.copy(color);
    Timpani.Material.needsUpdate = true;
    Timpani.LineMaterial.needsUpdate = true;
  };

  Timpani.prototype = Object.create(Item.Object3D.prototype);

  _.extend(Timpani.prototype, {

    start: function(origin, direction) {

      if (this.enabled) {
        return this;
      }

      Item.prototype.start.call(this, origin, direction);

      return this;

    },

    update: function(v, t) {

      var s = t;

      this.scale.set(s, s, s);
      return this;

    }

  });

})();