(function() {

  var root = this;
  var previousScene = root.Scene || {};

  var Scene = root.Scene = function() {

    Two.Group.call(this);

  };

  _.extend(Scene.prototype, Two.Group.prototype, {

    enabled: false,

    /**
     * Go through children and update the curve based on the camera
     * or something.
     */
    update: function() {



    }

  });

  Two.Group.MakeObservable(Scene.prototype);

})();