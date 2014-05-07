(function() {

  var root = this;
  var previousRoot = root.Clockhand || {};

  var Clockhand = root.Clockhand = function(two, type) {

    this.two = two;

    this.type = type || (Math.random() > 0.5 ? 'Hour' : 'Minute');

    this.shape = two.interpret(Clockhand[this.type]);
    this.shape.id = Two.Identifier + Two.uniqueId();

  };

  _.extend(Clockhand, {

    queue: [],

    Minute: null,

    Hour: null,

    _ready: false,

    loaded: function(f) {

      if (Clockhand._ready) {
        f();
        return;
      }

      Clockhand.queue.push(f);

    }

  });

  _.extend(Clockhand.prototype, {

    _rotation: 0,

    drag: 0.125,

    ready: function(f) {

      Clockhand.loaded(f);

      return this;

    },

    addTo: function(parent) {
      parent.add(this.shape);
      return this;
    },

    update: function() {
      this.shape.rotation += (this._rotation - this.shape._rotation) * this.drag;
      return this;
    }

  });

  Object.defineProperty(Clockhand.prototype, 'rotation', {
    get: function() {
      return this._rotation;
    },
    set: function(v) {
      this._rotation = v;
    }
  });

  $(function() {

    var loaded = _.after(2, function() {

      Clockhand._ready = true;

      _.each(Clockhand.queue, function(f) {
        f();
      });

      Clockhand.queue.length = 0;

    });

    $.get('./assets/shapes/hourhand.svg', function(resp) {

      Clockhand.Hour = $(resp).find('svg')[0];
      loaded();

    });

    $.get('./assets/shapes/minutehand.svg', function(resp) {

      Clockhand.Minute = $(resp).find('svg')[0];
      loaded();

    });

  });

})();