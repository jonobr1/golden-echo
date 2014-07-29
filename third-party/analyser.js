/**
 * Depends on sound.js
 *
 * @author jonobr1 / http://jonobr1.com
 */
(function() {

  var root = this;
  var previousAnalyser = root.Analyser || {};
  var ctx;

  var Analyser = root.Analyser = function(path, callback) {

    var scope = this;

    Sound.call(this, path, function() {

      scope.construct();

      callback.call(scope);

    });

  };

  _.extend(Analyser, {

    ready: Sound.ready

  });

  _.extend(Analyser.prototype, Sound.prototype, {

    /**
     * Called internally once Sound.js is loaded.
     */
    construct: function() {

      this.analyser = ctx.createAnalyser();
      this.analyser.connect(ctx.destination);

      return this;

    },

    stop: function() {

      if (!this.source) {
        return this;
      }

      this.source.disconnect(this.analyser);

      Sound.prototype.stop.apply(this, arguments);

      return this;

    },

    pause: function() {

      this.source.disconnect(this.analyser);

      Sound.prototype.pause.apply(this, arguments);

      return this;

    },

    play: function() {

      Sound.prototype.play.apply(this, arguments);

      this.source.connect(this.analyser);

      return this;

    }

  });

  Sound.ready(function() {

    ctx = Sound.ctx;

  });

})();