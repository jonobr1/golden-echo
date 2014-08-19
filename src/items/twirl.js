(function() {

  var root = this;
  var previousHook = root.Hook || {};

  var spread = 20, width = 60, height = 1, depth = 1;
  var offset = 400;

  var Hook = root.Hook = function() {

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

  };

  var geometry = new THREE.BoxGeometry(width, height, depth);
  var material = new THREE.MeshBasicMaterial({
    color: 0xffff99
  });

  Hook.prototype = Object.create(Item.Object3D.prototype);

  _.extend(Hook.prototype, {

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
        75 * Math.random(),
        0
      );

    }

  });

})();