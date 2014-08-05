(function() {

  var root = this;
  var previousItem = root.Item || {};

  var Superclass = THREE.Mesh, empty = {};
  var vector = new THREE.Vector3();

  var Item = root.Item = function() {

    var geometry = this.Geometry;
    var material = this.Material.clone();

    Superclass.call(this, geometry, material);

    this.tween = new TWEEN.Tween(this)
      .onUpdate(_.bind(this.update, this))
      .onComplete(_.bind(this.stop, this));

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
     * A normalized value to determine a scalar of some kind on the item's
     * geometry that is tied to the duration of the corresponding
     * audio's existence.
     */
    t: 0,

    /**
     * Is the item currently enabled?
     */
    enabled: false,

    /**
     * Call in order to place item in visible sight.
     */
    start: function(origin, direction) {

      this.reset();

      this.enabled = this.visible = true;

      vector.copy(this.offset).applyEuler(direction);

      this.position.copy(origin).add(vector);
      this.rotation.copy(direction);

      this.tween.to(empty, this.duration).start();

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
    stop: function() {

      if (!this.enabled) {
        return this;
      }

      this.visible = this.enabled = false;
      this.position.set(Infinity, Infinity, Infinity);

      this.tween.stop();

      return this;

    }

  });

})();