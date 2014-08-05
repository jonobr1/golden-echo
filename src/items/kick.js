(function() {

  var root = this;
  var previousKick = root.Kick || {};

  var resetCount = 0, vector = new THREE.Vector3();

  var Kick = root.Kick = function() {

    Item.call(this);

  };

  Kick.Offset = 33;

  Kick.prototype = Object.create(Item.prototype);

  _.extend(Kick.prototype, {

    Geometry: new THREE.BoxGeometry(5, 5, 5),

    Material: new THREE.MeshBasicMaterial({
      color: 'rgb(0, 200, 255)'
    }),

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      // this.scale.z = 1 + this.t * 10;

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