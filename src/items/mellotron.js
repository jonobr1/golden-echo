(function() {

  var root = this;
  var previousMellotron = root.Mellotron || {};

  var resetCount = 0, vector = new THREE.Vector3();

  var Mellotron = root.Mellotron = function() {

    Item.Object3D.call(this);

    this.add(new THREE.Line(geometry, material));
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * Math.PI / 30,
      (Math.random() - 0.5) * Math.PI / 30,
      (Math.random() - 0.5) * Math.PI / 30
    );

  };

  Mellotron.distinction = 5;
  Mellotron.Offset = spread = 50;

  var geometry = Mellotron.Geometry = new THREE.Geometry();
  var material = Mellotron.Material = new THREE.LineBasicMaterial({
    color: 0x3333ff,
    linewidth: 4
  });
  var amt = 7;
  var radius = 8;

  for (var i = 0; i < 1; i++) {

    var a = 'x', b = 'y';

    if (i > 0) {
      a = 'x';
      b = 'z';
    }

    for (var j = 0; j < amt; j++) {

      var pct = j / amt;
      var theta = pct * Math.PI * 2;
      var v = new THREE.Vector3();

      v[a] = radius * Math.cos(theta - Math.PI / 5);
      v[b] = radius * Math.sin(theta - Math.PI / 5);

      geometry.vertices.push(new THREE.Vector3(), v);

    }
  }

  Mellotron.colorDuration = 1000;
  Mellotron.changeColor = (function() {

    var tween = new TWEEN.Tween(Mellotron.Material.color)
      .onUpdate(function() {
        Mellotron.Material.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Mellotron.colorDuration)
      tween.start();
    };

  })();
  Mellotron.setColor = function(color) {
    Mellotron.Material.color.copy(color);
    Mellotron.Material.needsUpdate = true;
  };

  Mellotron.prototype = Object.create(Item.Object3D.prototype);

  // Mellotron.Line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
  //   color: 0x3333ff,
  //   linewidth: 4
  // }));

  _.extend(Mellotron.prototype, {

    start: function(origin, direction) {

      Item.Object3D.prototype.start.call(this, origin, direction);

      // this.rotation.set(
      //   Math.random() * Math.PI * 2,
      //   Math.random() * Math.PI * 2,
      //   Math.random() * Math.PI * 2
      // );

      var s = 1 + Math.random() * 0.2;
      this.scale.set(s, s, s);

      return this;

    },

    update: function() {

    //   this.rotation.x += this.velocity.x;
    //   this.rotation.y += this.velocity.y;
      this.rotation.z += this.velocity.z;

    },

    reset: function() {

      this.stop();

      this.offset.set(
        Math.random() * spread - spread / 2,
        Math.random() * spread / 2 + spread / 4,
        0
      );

      return this;

    }

  });

})();