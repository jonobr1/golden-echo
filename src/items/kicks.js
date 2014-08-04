(function() {

  var root = this;
  var previousKicks = root.Kicks || {};

  var resetCount = 0, vector = new THREE.Vector3();

  var Kicks = root.Kicks = function() {

    Item.call(this);

  };

  Kicks.Offset = 50;

  Kicks.prototype = Object.create(Item.prototype);

  _.extend(Kicks.prototype, {

    Geometry: new THREE.BoxGeometry(10, 10, 10),

    Material: new THREE.MeshBasicMaterial({
      color: 0xffffff
    }),

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      this.scale.z = Math.max(this.t, 1);
      this.scale.y = 1 + this.t;

      return this;

    },

    reset: function() {

      this.stop();

      switch (resetCount) {

        case 0:
          this.offset.x = - Kicks.Offset;// - Math.random() * Kicks.Offset * 2;
          break;
        case 1:
          this.offset.x = Kicks.Offset;// + Math.random() * Kicks.Offset * 2;
          break;

      }

      resetCount = (resetCount + 1) % 2;

      return this;

    }

  });

})();