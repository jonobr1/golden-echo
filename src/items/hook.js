(function() {

  var root = this;
  var previousHook = root.Hook || {};

  var spread = 66, width = 2, height = 100, depth = 2;
  var offset = 200;

  var Hook = root.Hook = function() {

    Item.Object3D.call(this);

    var amount = Math.floor(Math.random() * 8) + 1;

    for (var i = 0; i < amount; i++) {

      var pct = (i + 1) / (amount + 1);

      var mesh = new THREE.Mesh(geometry, material);
      mesh.scale.y = Math.sin(pct * Math.PI);

      mesh.position.y = mesh.scale.y * height / 2;
      mesh.position.x = spread * (pct - 0.5);

      this.add(mesh);

    }

    this.spinVelocity = Math.PI / 30;
    this.spinVeloity *= Math.random() > 0.5 ? 1 : -1;

    this.stepCount = Math.random() * Math.PI * 2;

    // this.tween.easing(TWEEN.Easing.Elastic.InOut);

  };

  var geometry = Hook.Geometry = new THREE.BoxGeometry(width, height, depth);
  var material = Hook.Material = new THREE.MeshBasicMaterial({
    color: 0xffff99
  });
  Hook.distinction = 3;
  Hook.colorDuration = 1000;
  Hook.changeColor = (function() {

    var tween = new TWEEN.Tween(Hook.Material.color)
      .onUpdate(function() {
        Hook.Material.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Hook.colorDuration)
      tween.start();
    };

  })();
  Hook.setColor = function(color) {
    Hook.Material.color.copy(color);
    Hook.Material.needsUpdate = true;
  };

  Hook.prototype = Object.create(Item.Object3D.prototype);

  _.extend(Hook.prototype, {

    stepCount: 0,

    spinVelocity: Math.PI / 30,

    start: function(origin, direction) {

      if (this.enabled) {
        return this;
      }

      Item.prototype.start.call(this, origin, direction);

      var s = this.t + 1;
      this.scale.set(s, 0.01, s);

      this.rotation.y = Math.random() * Math.PI * 2;
      this.position.y -= 10;

      return this;

    },

    update: function(v, t) {

      this.scale.y = Math.abs(Math.sin(this.stepCount)) + 0.01;
      this.stepCount += this.spinVelocity;

      return this;

    },

    reset: function() {

      this.offset.x = Math.random() * offset + offset / 2;

      if (Math.random() > 0.5) {
        this.offset.x *= -1;
      }

    }

  });

})();