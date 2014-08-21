(function() {

  var root = this;
  var previousProg = root.Prog || {};

  var resetCount = 0, vector = new THREE.Vector3();
  var width = 30, height = 60;

  var Prog = root.Prog = function() {

    Item.call(this);

  };

  Prog.distinction = 7;
  Prog.Offset = 100;

  var geometry = Prog.Geometry = new THREE.CylinderGeometry(0, width, height, 4, 4);
  var material = Prog.Material = new THREE.MeshBasicMaterial({
    color: 0x00e196
  });
  Prog.colorDuration = 1000;
  Prog.changeColor = (function() {

    var tween = new TWEEN.Tween(Prog.Material.color)
      .onUpdate(function() {
        Prog.Material.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Prog.colorDuration)
      tween.start();
    };

  })();
  Prog.setColor = function(color) {
    Prog.Material.color.copy(color);
    Prog.Material.needsUpdate = true;
  };

  Prog.prototype = Object.create(Item.prototype);

  _.extend(Prog.prototype, {

    Geometry: geometry,

    Material: material,

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      this.scale.y = this.t * 2 + 1;
      this.position.y += this.scale.y * height / 2 - 10;

      return this;

    },

    reset: function() {

      this.stop();
      var offset = Prog.Offset + Prog.Offset * Math.random();

      switch (resetCount) {

        case 0:
          this.offset.x = - offset;
          break;
        case 1:
          this.offset.x = offset;
          break;

      }

      resetCount = (resetCount + 1) % 2;

      return this;

    }

  });

})();