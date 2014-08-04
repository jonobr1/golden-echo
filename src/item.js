(function() {

  var root = this;
  var previousItem = root.Item || {};

  var Superclass = THREE.Mesh;

  var Item = root.Item = function() {

    var geometry = this.Geometry;
    var material = this.Material.clone();

    Superclass.call(this, geometry, material);

    this.tween = new TWEEN.Tween(this)
      .onUpdate(_.bind(this.update, this))
      .onComplete(_.bind(this.reset, this));

    this.offset = new THREE.Vector3();

    this.reset();

  };

  Item.prototype = Object.create(Superclass.prototype);

  _.extend(Item.prototype, {

    /**
     * The duration in milliseconds of how long the item stays visible.
     */
    duration: 0,

    /**
     * Is the item currently enabled?
     */
    enabled: false,

    /**
     * Call in order to place item in visible sight.
     */
    start: function(origin, direction) {

      if (this.enabled) {
        return this;
      }

      this.enabled = true;
      this.tween.start();

      return this;

    },

    /**
     * To be called every animation frame the item is visible.
     */
    update: function(t) {

      return this;

    },

    /**
     * Reset the state of the item to its initialized settings. i.e: previsible
     * rendered state.
     */
    reset: function() {

      this.visible = this.enabled = false;
      this.tween.stop();

      return this;

    }

  });

})();