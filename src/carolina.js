/**
 * @jonobr1 / http://jonobr1.com/
 */

(function() {

  var root = this;
  var previousCarolina = root.Carolina || {};

  var callbacks = [], two;

  var Carolina = root.Carolina = {

    /**
     * The song data to be played in the Web Audio API
     */
    audio: new Sound('audio/carolina.mp3', function() {

      Carolina._ready = true;
      _.each(callbacks, function(c) {
        c();
      });
      callbacks.length = 0;

    }),

    noConflict: function() {
      root.Carolina = previousCarolina;
      return Carolina;
    },

    /**
     * Internal Functions
     */

    _ready: false,

    ready: function(f) {
      if (Carolina._ready) {
        f();
        return Carolina;
      }
      callbacks.push(f);
      return Carolina;
    },

    currentTime: 0,

    /**
     * Setup drawing context.
     */
    init: function(callback) {

      two = new Two({
        fullscreen: true
      }).appendTo(document.body);

      Carolina.camera = new Camera(two.width, two.height);
      Carolina.camera.translation.set(two.width / 2, two.height);

      two
        .bind('resize', function() {

          Carolina.camera.resize(two.width, two.height);
          Carolina.camera.translation.set(two.width / 2, two.height);

        })
        .bind('update', function(frameCount, timeDelta) {

          if (Carolina.playing && timeDelta) {
            Carolina.currentTime += timeDelta / 1000;
          }

          TWEEN.update(Carolina.currentTime * 1000);

          for (var i = 0, l = Carolina.scenes.length; i < l; i++) {

            var scene = Carolina.scenes[i];

            if (!scene.enabled) {
              continue;
            }

            scene.update();

          }

        });

      Carolina.ready(callback);

      return Carolina;

    },

    playing: false,

    play: function() {

      if (Carolina.playing) {
        return Carolina;
      }

      two.play();

      Carolina.playing = true;
      Carolina.audio.play();

      return Carolina;

    },

    pause: function() {

      if (!Carolina.playing) {
        return Carolina;
      }

      Carolina.playing = false;

      two.pause();
      Carolina.audio.pause();

      return Carolina;

    },

    stop: function() {

      Carolina.currentTime = 0;
      Carolina.playing = false;

      two.pause();
      Carolina.audio.stop();

      return Carolina;

    },

    /**
     * The active scene.
     */
    active: null,

    camera: null,

    /**
     * Scenes
     */

    intro: (function() {

      var group = new Scene();

      return group;

    })(),

    outro: (function() {

      var group = new Scene();

      return group;

    })(),

    verses: [
      (function() {

        var group = new Scene();

        return group;

      })(),
      (function() {

        var group = new Scene();

        return group;

      })(),
      (function() {

        var group = new Scene();

        return group;

      })()
    ],

    chorus: (function() {

      var group = new Scene();

      return group;

    })(),

    transition: (function() {

      var group = new Scene();

      return group;

    })()

  };

  Carolina.scenes = [
    Carolina.intro,
    Carolina.verses[0],
    Carolina.verses[1],
    Carolina.verses[2],
    Carolina.chorus,
    Carolina.outro,
    Carolina.transition
  ];

})();