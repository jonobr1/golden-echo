(function() {

  var root = this;
  var previousKicks = root.Kicks || {};

  var resetCount = 0, vector = new THREE.Vector3();

  var Kicks = root.Kicks = function() {

    Item.call(this);

  };

  Kicks.Offset = 33 ;

  Kicks.prototype = Object.create(Item.prototype);

  _.extend(Kicks.prototype, {

    Geometry: new THREE.BoxGeometry(5, 5, 5),

    Material: new THREE.MeshBasicMaterial({
      color: 0xffffff
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
          this.offset.x = - Kicks.Offset;
          break;
        case 1:
          this.offset.x = Kicks.Offset;
          break;

      }

      resetCount = (resetCount + 1) % 2;

      return this;

    }

  });

})();