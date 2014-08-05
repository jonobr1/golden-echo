(function() {

  var root = this;
  var previousProg = root.Prog || {};

  var resetCount = 0, vector = new THREE.Vector3();

  var Prog = root.Prog = function() {

    Item.call(this);

  };

  Prog.Offset = 100;

  Prog.prototype = Object.create(Item.prototype);

  _.extend(Prog.prototype, {

    Geometry: new THREE.CylinderGeometry(0, 20, 40, 4, 4),

    Material: new THREE.MeshBasicMaterial({
      color: 0x00e196
    }),

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

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