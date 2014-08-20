/**
 * @jonobr1 / http://jonobr1.com/
 */

(function() {

  var root = this;
  var previousCarolina = root.Carolina || {};

  var callbacks = [], lastFrame, nullObject = new THREE.Object3D();
  var vector = new THREE.Vector3();

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

    // TODO: Utilize palettes
    palette: [
      {
        background: new THREE.Color(0xff7777)
      }
    ],

    colors: {
      background: new THREE.Color(0xff7777)
    },

    /**
     * Setup drawing context.
     */
    init: function(callback) {

      // Create the renderer and other initial objects
      Carolina.renderer = new THREE.WebGLRenderer({ antialias: false });
      Carolina.scene = new THREE.Scene();

      Carolina.ground = new THREE.Object3D();
      Carolina.ground.position.y = - 10;

      Carolina.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      Carolina.camera.destFov = 75;

      Carolina.camera.velocity = Carolina.camera.destVelocity = Carolina.camera.far * 5 / 1000;
      Carolina.camera.cone = (function() {

        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 4, 32), new THREE.MeshBasicMaterial({
          color: 0x555555
        }));

        mesh.rotation.x = - Math.PI / 2;

        var group = new THREE.Object3D();
        group.add(mesh);

        mesh.visible = false;

        return group;

      })();
      Carolina.camera.influence = new THREE.Euler().copy(Carolina.camera.cone.rotation);
      Carolina.camera.cone.position.set(0, Carolina.ground.position.y, - 20);

      Carolina.scene.fog = new THREE.Fog(Carolina.colors.background, Carolina.camera.far * 0.75, Carolina.camera.far);
      Carolina.renderer.setClearColor(Carolina.colors.background, 1);

      Carolina.path = new Path(Carolina.camera);

      Carolina.scene.add(Carolina.ground);
      Carolina.scene.add(Carolina.camera);
      Carolina.camera.add(Carolina.camera.cone);

      var yaw = new THREE.Vector3();
      var drag = function(e) {

        var pct = e.clientX / window.innerWidth;
        var dest = (1 - pct) * Carolina.radialBreadth - Carolina.radialBreadth / 2;
        Carolina.camera.cone.rotation.y += (dest - Carolina.camera.cone.rotation.y) * Carolina.drag;

        // pct = e.clientY / window.innerHeight;
        // Carolina.camera.cone.rotation.x = (1 - pct) * Math.PI / 4 - Math.PI / 8;

      };

      var speedUp = function(e) {
        Carolina.camera.destVelocity = Carolina.camera.far * 7 / 1000;;
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
      document.body.appendChild(Carolina.renderer.domElement);

      Carolina.two = new Two({
        fullscreen: true
      }).appendTo(document.body);

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

      Carolina.camera.fov += (Carolina.camera.destFov - Carolina.camera.fov) * 0.33;
      Carolina.camera.updateProjectionMatrix();
      Carolina.camera.velocity += (Carolina.camera.destVelocity - Carolina.camera.velocity) * 0.33;

      Carolina.renderer.render(Carolina.scene, Carolina.camera);

      return Carolina;

    },

    resize: function() {

      var width = (screen && screen.width) || window.innerWidth;
      var height = (screen && screen.height) || window.innerHeight;

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

      switch (struct.type) {
        case '2d':
          struct.setInstance(Carolina.two);
          break;
      }

      var list = _.map(_.range(size), function(i) {
        var obj = new Carolina.structs[name]();
        switch (struct.type) {
          case '2d':
            break;
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
    }

  };

  loop();

  function loop() {

    requestAnimationFrame(loop);

    Carolina.loop();

  }

})();