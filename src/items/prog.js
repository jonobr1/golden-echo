(function() {

  var root = this;
  var previousProg = root.Prog || {};

  var resetCount = 0, vector = new THREE.Vector3();
  var width = 20, height = 40;

  var Prog = root.Prog = function() {

    Item.call(this);

  };

  Prog.Offset = 100;

  Prog.prototype = Object.create(Item.prototype);

  _.extend(Prog.prototype, {

    Geometry: new THREE.CylinderGeometry(0, width, height, 4, 4),

    Material: new THREE.MeshBasicMaterial({
      color: 0x00e196
    }),

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      this.scale.y = this.t * 2 + 1;
      this.position.y += this.scale.y * height / 4;

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