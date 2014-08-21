/**
 * @jonobr1 / http://jonobr1.com/
 */

(function() {

  var root = this;
  var previousCarolina = root.Carolina || {};

  var callbacks = [], lastFrame, nullObject = new THREE.Object3D();
  var vector = new THREE.Vector3();

  var pacing = [
    { startTime: 0, palette: 0 },
    { startTime: 40.41720300000004 * 1000, palette: 1 },
    { startTime: 72.06894500000004 * 1000, palette: 2 },
    { startTime: 95.51321599999989 * 1000, palette: 4 },
    { startTime: 142.6998529999998 * 1000, palette: 3 },
    { startTime: 166.29350599999967 * 1000, palette: 4 },
    { startTime: 229.26353299999968 * 1000, palette: 0 }
  ];
  pacing.index = 0;

  var feelingIt = [
    { startTime: 100.37431099999995 * 1000 },
    { startTime: 102.31557599999991 * 1000 },
    { startTime: 108.26768899999989 * 1000 },
    { startTime: 116.13101599999978 * 1000 },
    { startTime: 118.05033499999975 * 1000 },
    { startTime: 171.1942029999997 * 1000 },
    { startTime: 173.12963699999986 * 1000 },
    { startTime: 179.08271100000007 * 1000 },
    { startTime: 186.92243099999982 * 1000 },
    { startTime: 188.89720899999975 * 1000 }
    // { startTime: 194.8994769999995 * 1000 }
  ];
  feelingIt.index = 0;

  var finalStrike = [
    { startTime: 242.250568000001 * 1000 }
  ];
  finalStrike.index = 0;

  var colors = {
    lobby: [
      'rgb(255, 255, 255)',
      'rgb(222, 62, 81)',
      'rgb(92, 148, 66)',
      'rgb(237, 115, 54)',
      'rgb(238, 110, 73)',
      'rgb(121, 73, 140)',
      'rgb(40, 78, 120)',
      'rgb(99, 46, 30)',
      'rgb(58, 71, 100)',
      'rgb(239, 173, 180)'
    ],
    firstVerse: [
      'rgb(211, 211, 211)',
      'rgb(254, 235, 132)',
      'rgb(235, 112, 77)',
      'rgb(0, 185, 242)',
      'rgb(70, 184, 85)',
      'rgb(184, 73, 120)',
      'rgb(109, 100, 147)',
      'rgb(68, 88, 113)',
      'rgb(12, 12, 12)',
      'rgb(70, 106, 208)'
    ],
    secondVerse: [
      'rgb(197, 220, 223)',
      'rgb(96, 128, 182)',
      'rgb(132, 175, 191)',
      'rgb(253, 148, 144)',
      'rgb(254, 233, 126)',
      'rgb(225, 253, 223)',
      'rgb(172, 172, 172)',
      'rgb(147, 185, 151)',
      'rgb(20, 20, 20)',
      'rgb(247, 149, 82)'
    ],
    thirdVerse: [
      'rgb(151, 244, 255)',
      'rgb(251, 243, 176)',
      'rgb(165, 220, 141)',
      'rgb(133, 106, 166)',
      'rgb(237, 148, 179)',
      'rgb(88, 90, 225)',
      'rgb(41, 53, 188)',
      'rgb(55, 55, 55)',
      'rgb(246, 50, 50)',
      'rgb(250, 200, 120)'
    ],
    chorus: [
      'rgb(245, 233, 120)',
      'rgb(155, 136, 162)',
      'rgb(255, 9, 89)',
      'rgb(229, 23, 87)',
      'rgb(12, 109, 82)',
      'rgb(220, 14, 2)',
      'rgb(104, 135, 5)',
      'rgb(131, 161, 197)',
      'rgb(126, 61, 100)',
      'rgb(212, 110, 25)'
    ]
  };

  _.each(colors, function(list, name) {
    _.each(list, function(color, i) {
      colors[name][i] = new THREE.Color(color);
    });
  });

  var onload = _.after(2, function() {

    Carolina._ready = true;
    _.each(callbacks, function(c) {
      c();
    });
    callbacks.length = 0;

  });

  var Carolina = root.Carolina = {

    triggers: (function() {

      var triggers = {};
      var types = [
        'prog',
        'kick',
        'perc',
        'timpani',
        'bass',
        'hook',
        'guitar',
        'mellotron',
        'vanguard'
      ];
      var ready = _.after(types.length, onload);

      _.each(types, function(type) {

        xhr.getJSON('./data/' + type + '.json', function(data) {
          triggers[type] = data;
          data.index = 0;
          Carolina.register(type, Math.max(Math.floor(data.length / 10), 1));
          ready();
        });

      });

      return triggers;

    })(),

    /**
     * The song data to be played in the Web Audio API
     */
    audio: new Sound('audio/carolina.mp3', onload),

    noConflict: function() {
      root.Carolina = previousCarolina;
      return Carolina;
    },

    /**
     * Internal Functions
     */

    _ready: false,

    __onEnded: _.identity,

    ready: function(f) {
      if (Carolina._ready) {
        f();
        return Carolina;
      }
      callbacks.push(f);
      return Carolina;
    },

    currentTime: 0,

    drag: 0.125,

    radialBreadth: Math.PI / 4,

    radialResolution: 24,

    palette: [
      colors.lobby,
      colors.firstVerse,
      colors.secondVerse,
      colors.thirdVerse,
      colors.chorus
    ],

    /**
     * Setup drawing context.
     */
    init: function(callback) {

      var container = document.querySelector('#content');

      // Create the renderer and other initial objects
      Carolina.renderer = new THREE.WebGLRenderer({ antialias: false });
      Carolina.scene = new THREE.Scene();

      Carolina.ground = new THREE.Object3D();
      Carolina.ground.position.y = - 10;

      Carolina.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
      Carolina.camera.destFov = 70;

      Carolina.camera.velocity = Carolina.camera.destVelocity = Carolina.camera.far * 5 / 1000;
      Carolina.camera.cone = (function() {

        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 4, 32), new THREE.MeshBasicMaterial({
          color: 0x555555
        }));

        mesh.rotation.x = - Math.PI / 2;

        var group = new THREE.Object3D();
        group.add(mesh);

        // mesh.visible = false;

        return group;

      })();
      Carolina.camera.influence = new THREE.Euler().copy(Carolina.camera.cone.rotation);
      Carolina.camera.cone.position.set(0, Carolina.ground.position.y, - 20);

      Carolina.scene.fog = new THREE.Fog(0xffffff, Carolina.camera.far * 0.75, Carolina.camera.far);
      Carolina.renderer.setClearColor(0xffffff, 1);

      Carolina.path = new Path(Carolina.camera);

      Carolina.scene.add(Carolina.ground);
      Carolina.scene.add(Carolina.camera);
      Carolina.camera.add(Carolina.camera.cone);

      var px = window.innerWidth / 2;
      var pct = 0.5;
      var drag = function(e) {

        var dpct = ((e.clientX - px) / window.innerWidth) || 0;
        pct = Math.max(Math.min(pct + dpct, 1), 0);

        var dest = (1 - pct) * Carolina.radialBreadth - Carolina.radialBreadth / 2;
        Carolina.camera.cone.rotation.y += (dest - Carolina.camera.cone.rotation.y) * Carolina.drag;

        // // pct = e.clientY / window.innerHeight;
        // // Carolina.camera.cone.rotation.x = (1 - pct) * Math.PI / 4 - Math.PI / 8;

        px = e.clientX;

      };

      var speedUp = function(e) {
        Carolina.camera.destVelocity = Carolina.camera.far * 7 / 1000;;
        px = e.clientX;
        // Carolina.camera.destFov = 45;
      };
      var slowDown = function(e) {
        Carolina.camera.destVelocity = Carolina.camera.far * 5 / 1000;;
        // Carolina.camera.destFov = 75;
      };

      window.addEventListener('touchstart', speedUp, false);
      window.addEventListener('touchend', slowDown, false);
      window.addEventListener('touchcancel', slowDown, false);
      window.addEventListener('mousedown', speedUp, false);
      window.addEventListener('mouseup', slowDown, false);

      window.addEventListener('touchstart', function(e) {

        e.preventDefault();

        var touch = e.changedTouches[0];

        drag({
          clientX: touch.pageX,
          clientY: touch.pageY
        });

        return false;

      }, false);
      window.addEventListener('touchmove', function(e) {

        e.preventDefault();

        var touch = e.changedTouches[0];

        drag({
          clientX: touch.pageX,
          clientY: touch.pageY
        });

        return false;

      }, false);
      window.addEventListener('mousemove', drag, false);
      window.addEventListener('resize', Carolina.resize, false);
      Carolina.resize();

      Carolina.renderer.render(Carolina.scene, Carolina.camera);
      container.appendChild(Carolina.renderer.domElement);

      // Carolina.two = new Two({
      //   fullscreen: true
      // }).appendTo(container);

      Carolina.ready(callback);

      return Carolina;

    },

    playing: false,

    play: function(options) {

      if (Carolina.playing) {
        return Carolina;
      }

      lastFrame = TWEEN.clock.now();

      Carolina.playing = true;
      Carolina.audio.play(options);

      // Carolina.loop();
      Carolina.currentTime = options && _.isNumber(options.elapsed) ? options.elapsed : Carolina.currentTime;

      return Carolina;

    },

    pause: function() {

      Carolina.playing = false;
      Carolina.audio.pause();

      return Carolina;

    },

    stop: function() {

      Carolina.currentTime = 0;
      pacing.index = 0;
      feelingIt.index = 0;
      finalStrike.index = 0;
      Carolina.playing = false;

      Carolina.audio.stop();

      _.each(Carolina.triggers, function(trigger) {
        trigger.index = 0;
      });

      TWEEN.removeAll();

      return Carolina;

    },

    loop: function() {

      if (!Carolina.playing) {
        return;
      }

      var timeDelta, now = TWEEN.clock.now();

      if (!!lastFrame) {
        timeDelta = parseFloat((now - lastFrame).toFixed(3));
      }
      lastFrame = now;

      if (Carolina.playing && timeDelta) {
        Carolina.currentTime += timeDelta / 1000;
      }

      var minDuration = Math.floor(timeDelta * (Carolina.camera.far / Carolina.camera.velocity));
      var currentMillis = Carolina.currentTime * 1000;
      var bufferMillis = minDuration * 0.5;

      TWEEN.update(currentMillis);

      Carolina.camera.influence._x += Carolina.camera.cone.rotation._x / Carolina.radialResolution;
      Carolina.camera.influence._y += Carolina.camera.cone.rotation._y / Carolina.radialResolution;
      Carolina.camera.influence._z += Carolina.camera.cone.rotation._z / Carolina.radialResolution;

      Carolina.path.update();

      nullObject.position.copy(Carolina.path.points[1]);
      nullObject.lookAt(Carolina.path.points[0]);

      vector.copy(Carolina.path.getPoint(0.1));

      for (var k in Carolina.triggers) {

        var list = Carolina.triggers[k];

        if (list.index >= list.length) {
          continue;
        }

        var t = list[list.index];

        if (t.startTime <= currentMillis + bufferMillis) {
          var o = Carolina.objects[k].active;
          o.duration = minDuration * 2;
          o.t = t.duration / 1000;
          o.start(vector, nullObject.rotation);
          list.index++;
        }

      }

      if (pacing.index < pacing.length && pacing[pacing.index].startTime <= currentMillis) {
        Carolina.setColors(Carolina.palette[pacing[pacing.index].palette]);
        pacing.index++;
      }

      if (feelingIt.index < feelingIt.length && feelingIt[feelingIt.index].startTime <= currentMillis) {
        // Carolina.camera.fov = 1;
        Carolina.camera.destFov = Carolina.camera.destFov === 70 ? 140 : 70;
        feelingIt.index++;
      }

      if (finalStrike.index < finalStrike.length && finalStrike[finalStrike.index].startTime <= currentMillis) {
        Carolina.__onEnded();
        finalStrike.index++;
      }

      Carolina.camera.fov += (Carolina.camera.destFov - Carolina.camera.fov) * 0.0625;
      Carolina.camera.updateProjectionMatrix();
      Carolina.camera.velocity += (Carolina.camera.destVelocity - Carolina.camera.velocity) * 0.33;

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
     * Scene construction
     */

    objects: {},

    instances: [],

    structs: {

      'prog': Prog,
      'kick': Kick,
      'perc': Perc,
      'timpani': Timpani,
      'bass': Bass,
      'hook': Hook,
      'guitar': Guitar,
      'mellotron': Mellotron,
      'vanguard': Vanguard

    },

    register: function(name, size) {

      console.log('There will be', size, name);

      var struct = Carolina.structs[name];

      // switch (struct.type) {
      //   case '2d':
      //     struct.setInstance(Carolina.two);
      //     break;
      // }

      var list = _.map(_.range(size), function(i) {
        var obj = new Carolina.structs[name]();
        switch (struct.type) {
          // case '2d':
          //   break;
          default:
            Carolina.ground.add(obj);
        }
        return obj;
      });

      this.objects[name] = new Pool(list);
      this.instances = this.instances.concat(list);

      return Carolina;

    },

    reset: function(options) {
      Carolina.stop().play(options);
      return Carolina;
    },

    setColors: function(palette) {

      for (var k in Carolina.structs) {
        var struct = Carolina.structs[k];
        var color = palette[struct.distinction % palette.length];
        struct.setColor(color);
      }

      Carolina.setBackground(palette[0]);

      // Carolina.scene.fog.color.copy(palette[0]);
      // Carolina.renderer.setClearColor(palette[0], 1);

      return Carolina;

    },

    setPalette: function(palette) {

      for (var k in Carolina.structs) {
        var struct = Carolina.structs[k];
        var color = palette[struct.distinction % palette.length];
        struct.changeColor(color);
      }

      Carolina.setBackground(palette[0]);

      return Carolina;

    },

    colorDuration: 1000,

    setBackground: (function() {

      var color = new THREE.Color();
      var tween = new TWEEN.Tween(color)
        .onUpdate(function() {

          Carolina.scene.fog.color.copy(color);
          Carolina.renderer.setClearColor(color, 1);
          document.body.style.background = 'rgb('
            + Math.floor(color.r * 255) + ','
            + Math.floor(color.g * 255) + ','
            + Math.floor(color.b * 255) + ')';

        })
        .onComplete(function() {
          tween.stop();
        });

      return function(c, duration) {
        tween.to(c, duration || Carolina.colorDuration)
        tween.start();
      };

    })()

  };

  loop();

  function loop() {

    requestAnimationFrame(loop);

    Carolina.loop();

  }

})();