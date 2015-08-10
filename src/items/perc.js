(function() {

  var root = this;
  var previousPerc = root.Perc || {};

  var vector = new THREE.Vector3();
  var geometry = new THREE.Geometry();
  var MAT = new THREE.Matrix4();
  var amt = Math.PI / 120;

  geometry.vertices = _.map(_.range(250), function(i) {

    var radius = 250;
    var theta = Math.random() * Math.PI * 2;
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);

    MAT.identity()
      .makeRotationY(Math.random() * Math.PI * 2);

    return new THREE.Vector3(x, y, 0).applyMatrix4(MAT);

  });

  var Perc = root.Perc = function() {

    Item.PointCloud.call(this);

    this.reset();
    this.position.set(-1000, -1000, -1000);

  };

  Perc.prototype = Object.create(Item.PointCloud.prototype);

  var directions = [
    'x', 'y', 'z'
  ];
  var canvas = document.createElement('canvas');

  canvas.width = 64;
  canvas.height = 64;

  var ctx = canvas.getContext('2d');

  ctx.strokeStyle = ctx.fillStyle = 'white';
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width - ctx.lineWidth) / 2, 0, Math.PI * 2, false);
  ctx.fill();

  Perc.Geometry = geometry;
  var material = Perc.Material = new THREE.PointCloudMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    opacity: 0.66,
    blending: THREE.AdditiveBlending,
    map: new THREE.Texture(canvas)
  });

  Perc.distinction = 6;
  Perc.colorDuration = 1000;
  Perc.changeColor = (function() {

    var tween = new TWEEN.Tween(Perc.Material.color)
      .onUpdate(function() {
        Perc.Material.needsUpdate = true;
      }).onComplete(function() {
        tween.stop();
      });;

    return function(c, duration) {
      tween.to(c, duration || Perc.colorDuration)
      tween.start();
    };

  })();
  Perc.setColor = function(color) {
    Perc.Material.color.copy(color);
    Perc.Material.needsUpdate = true;
  };

  if (material.map) {
    material.map.needsUpdate = true;
  }

  _.extend(Perc.prototype, {

    Geometry: geometry,

    Material: material,

    velocity: 0,

    property: 'y',

    start: function(origin, direction) {

      Item.prototype.start.call(this, origin, direction);

      this.rotation.set(
        0,
        Math.random() * Math.PI * 2,
        0
      );

      return this;

    },

    update: function() {

      this.rotation[this.property] += this.velocity;

      return this;

    },

    reset: function() {

      this.stop();

      this.velocity = Math.random() * amt - amt / 2;
      this.property = directions[Math.floor(Math.random() * directions.length)];

      return this;

    }

  });

})();