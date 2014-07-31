/**
 * @jonobr1 / http://jonobr1.com/
 */

(function() {

  var root = this;
  var previousCarolina = root.Carolina || {};

  var callbacks = [], lastFrame;

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

      // Create the renderer and other initial objects
      Carolina.renderer = new THREE.WebGLRenderer({ antialias: false });
      Carolina.scene = new THREE.Scene();
      Carolina.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      Carolina.path = new Path(Carolina.camera);

      Carolina.camera.cone = (function() {

        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 4), new THREE.MeshBasicMaterial({
          color: 0xff7777
        }));

        mesh.rotation.x = - Math.PI / 2;

        var group = new THREE.Object3D();
        group.add(mesh);

        return group;

      })();

      Carolina.camera.cone.position.set(0, - 10, - 20);

      Carolina.scene.add(Carolina.camera);
      Carolina.camera.add(Carolina.camera.cone);

      window.addEventListener('resize', Carolina.resize, false);
      Carolina.resize();

      document.body.appendChild(Carolina.renderer.domElement);

      Carolina.ready(callback);

      return Carolina;

    },

    playing: false,

    play: function() {

      if (Carolina.playing) {
        return Carolina;
      }

      Carolina.playing = true;
      Carolina.audio.play();

      Carolina.loop();

      return Carolina;

    },

    pause: function() {

      if (!Carolina.playing) {
        return Carolina;
      }

      Carolina.playing = false;
      Carolina.audio.pause();

      return Carolina;

    },

    stop: function() {

      Carolina.currentTime = 0;
      Carolina.playing = false;

      Carolina.audio.stop();

      return Carolina;

    },

    loop: function() {

      var timeDelta, now = TWEEN.clock.now();

      if (!!lastFrame) {
        timeDelta = parseFloat((now - lastFrame).toFixed(3));
      }
      lastFrame = now;

      if (Carolina.playing) {
        requestAnimationFrame(Carolina.loop);
      }

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

      Carolina.renderer.render(Carolina.scene, Carolina.camera);

      return Carolina;

    },

    resize: function() {

      var width = window.innerWidth;
      var height = window.innerHeight;

      Carolina.renderer.setSize(width, height);
      Carolina.camera.aspect = width / height;
      Carolina.camera.updateProjectionMatrix();

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

      var group = {};

      return group;

    })(),

    outro: (function() {

      var group = {};

      return group;

    })(),

    verses: [
      (function() {

        var group = {};

        return group;

      })(),
      (function() {

        var group = {};

        return group;

      })(),
      (function() {

        var group = {};

        return group;

      })()
    ],

    chorus: (function() {

      var group = {};

      return group;

    })(),

    transition: (function() {

      var group = {};

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