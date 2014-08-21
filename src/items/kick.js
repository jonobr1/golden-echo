(function() {

  var root = this;
  var previousKick = root.Kick || {};

  var resetCount = 0, vector = new THREE.Vector3();

  var Kick = root.Kick = function() {

    Item.call(this);

  };

  Kick.distinction = 4;
  Kick.Offset = 33;
  var geometry = Kick.Geometry = new THREE.BoxGeometry(10, 10, 10)
  var material = Kick.Material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  Kick.colorDuration = 1000;
  Kick.changeColor = (function() {

    var tween = new TWEEN.Tween(Kick.Material.color)
      .onUpdate(function() {
        Kick.Material.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Kick.colorDuration)
      tween.start();
    };

  })();
  Kick.setColor = function(color) {
    Kick.Material.color.copy(color);
    Kick.Material.needsUpdate = true;
  };

  Kick.prototype = Object.create(Item.prototype);

  _.extend(Kick.prototype, {

    Geometry: geometry,

    Material: material,

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      return this;

    },

    reset: function() {

      this.stop();

      switch (resetCount) {

        case 0:
          this.offset.x = - Kick.Offset;
          break;
        case 1:
          this.offset.x = Kick.Offset;
          break;

      }

      resetCount = (resetCount + 1) % 2;

      return this;

    }

  });

})();