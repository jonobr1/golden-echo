(function() {

  var root = this;
  var previousVanguard = root.Vanguard || {};

  var spread = 20, width = 60, height = 1, depth = 1;
  var offset = 400;

  var Vanguard = root.Vanguard = function() {

    Item.Object3D.call(this);

    var amount = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < amount; i++) {

      var pct = (i + 1) / (amount + 1);

      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = pct * (Math.PI * amount / 8);
      mesh.scale.x = Math.sin(pct * Math.PI);

      mesh.position.y = spread * (pct - 0.5);

      this.add(mesh);

    }

    this.spinVelocity = Math.random() * Math.PI / 60 + Math.PI / 60;
    this.spinVeloity *= Math.random() > 0.5 ? 1 : -1;

    this.position.set(Infinity, Infinity, Infinity);

  };

  var geometry = Vanguard.Geometry = new THREE.BoxGeometry(width, height, depth);
  var material = Vanguard.Material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  Vanguard.distinction = 9;
  Vanguard.colorDuration = 1000;
  Vanguard.changeColor = (function() {

    var tween = new TWEEN.Tween(Vanguard.Material.color)
      .onUpdate(function() {
        Vanguard.Material.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Vanguard.colorDuration)
      tween.start();
    };

  })();
  Vanguard.setColor = function(color) {
    Vanguard.Material.color.copy(color);
    Vanguard.Material.needsUpdate = true;
  };

  Vanguard.prototype = Object.create(Item.Object3D.prototype);

  _.extend(Vanguard.prototype, {

    spinVelocity: Math.PI / 30,

    start: function(origin, direction) {

      if (this.enabled) {
        return this;
      }

      Item.prototype.start.call(this, origin, direction);

      var s = this.t + 1;
      this.scale.set(s, s, s);

      return this;

    },

    update: function(v, t) {

      for (var i = 0, l = this.children.length; i < l; i++) {
        var mesh = this.children[i];
        mesh.rotation.y += this.spinVelocity;
      }

      return this;

    },

    reset: function() {

      this.offset.set(
        Math.random() * offset - offset / 2,
        offset * Math.random() / 2,
        0
      );

    }

  });

})();