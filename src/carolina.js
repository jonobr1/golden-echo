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
        // 'snare'
        'kicks'
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
      Carolina.camera.velocity = Carolina.camera.far * 5 / 1000;
      Carolina.camera.cone = (function() {

        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 4, 32), new THREE.MeshBasicMaterial({
          color: 0xff7777
        }));

        mesh.rotation.x = - Math.PI / 2;

        var group = new THREE.Object3D();
        group.add(mesh);

        return group;

      })();
      Carolina.camera.influence = new THREE.Euler().copy(Carolina.camera.cone.rotation);
      Carolina.camera.cone.position.set(0, Carolina.ground.position.y, - 20);

      Carolina.path = new Path(Carolina.camera);

      Carolina.scene.add(Carolina.ground);
      Carolina.scene.add(Carolina.camera);
      Carolina.camera.add(Carolina.camera.cone);

      // var pointCloud = (function() {

      //   var amt = 5000;

      //   var mesh = new THREE.PointCloud(new THREE.Geometry(), new THREE.PointCloudMaterial({
      //     color: 0xffffff,
      //     size: 3,
      //     sizeAttenuation: true
      //   }));

      //   for (var i = 0; i < amt; i++) {
      //     var x = Math.random() * Carolina.camera.far * 2 - Carolina.camera.far;
      //     var y = Math.random() * Carolina.camera.far;
      //     var z = Math.random() * Carolina.camera.far * 10;
      //     mesh.geometry.vertices.push(new THREE.Vector3(x, y, z));
      //   }

      //   mesh.geometry.verticesNeedUpdate = true;

      //   return mesh;

      // })();

      // Carolina.ground.add(pointCloud);

      var drag = function(e) {

        var pct = e.clientX / window.innerWidth;
        var dest = (1 - pct) * Carolina.radialBreadth - Carolina.radialBreadth / 2;
        Carolina.camera.cone.rotation.y += (dest - Carolina.camera.cone.rotation.y) * Carolina.drag;

      };

      window.addEventListener('touchmove', function(e) {

        var touch = e.changedTouches[0];

        drag({
          clientX: touch.pageX,
          clientY: touch.pageY
        });

      }, false);
      window.addEventListener('mousemove', drag, false);
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

      lastFrame = TWEEN.clock.now();

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

      var minDuration = Math.floor(timeDelta * (Carolina.camera.far / Carolina.camera.velocity));
      var currentMillis = Carolina.currentTime * 1000;
      var bufferMillis = minDuration * 1.25;

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
          o.duration = minDuration;
          o.t = t.duration / 1000;
          o.start(vector, nullObject.rotation);
          list.index++;
        }

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
     * Scene construction
     */

    objects: {},

    instances: [],

    structs: {

      // 'snare': Snare
      'kicks': Kicks

    },

    register: function(name, size) {

      console.log('There will be', size, name);

      var list = _.map(_.range(size), function(i) {
        var obj = new Carolina.structs[name]();
        Carolina.ground.add(obj);
        return obj;
      });

      this.objects[name] = new Pool(list);
      this.instances = this.instances.concat(list);

      return Carolina;

    }

  };

})();