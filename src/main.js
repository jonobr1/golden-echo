
var two = new Two({
  type: Two.Types.canvas,
  fullscreen: true
}).appendTo(document.body);

two.background = two.makeGroup();
two.frame = two.makeRectangle(two.width / 2, two.height / 2, two.width - 40, two.height - 40);
two.frame.linewidth = 4;
two.frame.noFill();

for (var i = 0; i < 6; i++) {
  var shape = createShape();
  shape.noStroke();
  two.background.add(shape);
}

var bgc = [
  Carolina.palette[1],
  Carolina.palette[2],
  Carolina.palette[4],
  Carolina.palette[3]
];

var $titles = document.querySelector('#intertitles').children;
$titles.index = 0;

var intertitles = [];

var loop = function() {

  var index = $titles.index;
  var length = $titles.length;

  var child = $titles[index];
  var group = two.interpret(child).center();
  group.stroke = '#' + bgc[index][2].getHexString();
  group.visible = false;

  for (var i = 0; i < group.children.length; i++) {
    var shape = group.children[i];
    for (var j = 0; j < shape.vertices.length; j++) {
      var v = shape.vertices[j];
      v.origin = new Two.Vector(v.x, v.y);
    }
  }

  intertitles.push(group);

  $titles.index++;

  if (index < length - 1) {
    // requestAnimationFrame(loop);
    loop();
  } else {
    requestAnimationFrame(titlesLoaded);
  }

};

loop();

intertitles.palette = bgc;
intertitles._current = 0;

Object.defineProperty(intertitles, 'current', {
  get: function() {
    return intertitles._current;
  },
  set: function(v) {
    intertitles._current = v;
    var i, palette = intertitles.palette[v];
    for (i = 0; i < intertitles.length; i++) {
      intertitles[i].visible = (i === v);
    }
    two.frame.stroke = '#' + bgc[v][2].getHexString();
    two.renderer.domElement.style.backgroundColor = '#' + palette[0].getHexString();
    for (i = 0; i < two.background.children.length; i++) {
      var child = two.background.children[i];
      child.update('#' + palette[Math.floor(Math.random() * (palette.length - 3) + 3)].getHexString());
    }
  }
});
intertitles.current = 0;
intertitles.radius = 2;

var offset = 0;
var limit = 10;

two
  .bind('resize', function() {
    for (var i = 0; i < intertitles.length; i++) {
      intertitles[i].translation.set(two.width / 2, two.height / 2);
    }
    var w = (two.width - 40) / 2;
    var h = (two.height - 40) / 2;
    two.frame.vertices[0].set(
      - w, - h
    );
    two.frame.vertices[1].set(
      w, - h
    );
    two.frame.vertices[2].set(
      w, h
    );
    two.frame.vertices[3].set(
      - w, h
    );
    two.frame.translation.set(two.width / 2, two.height / 2);
  })
  .bind('update', function(frameCount, timeDelta) {

    if (!timeDelta) {
      return;
    }

    if ((frameCount % 2)) {
      return;
    }

    var current = intertitles[intertitles._current];
    var start = offset;
    var theta = frameCount / 10;

    while (offset < start + limit) {

      var a = current.children[offset % current.children.length];
      var b = two.background.children[offset % two.background.children.length];
      var l = Math.max(a.vertices.length, b.vertices.length);

      for (var j = 0; j < l; j++) {
        var v = a.vertices[j];
        if (v) {
          v.set(
            v.origin.x + Math.random() * intertitles.radius - intertitles.radius / 2,
            v.origin.y + Math.random() * intertitles.radius - intertitles.radius / 2
          );
        }
        v = b.vertices[j];
        if (v) {
          var t = v.direction * (theta + v.startTime);
          v.set(
            v.origin.x + Math.random() * intertitles.radius - intertitles.radius / 2, // intertitles.radius * Math.cos(t) + v.origin.x, // 
            v.origin.y + Math.random() * intertitles.radius - intertitles.radius / 2  // intertitles.radius * Math.sin(t) + v.origin.y  // 
          );
        }
      }

      offset++;

    }

  });

var eye = new Eye(150, 150, '#00bcf2');
var startButton = eye.two.renderer.domElement;
_.extend(startButton.style, {
  position: 'absolute',
  display: 'none',
  top: 50 + '%',
  left: 50 + '%',
  marginLeft: - eye.two.width / 2 + 'px',
  marginTop: - eye.two.height / 2 + 'px',
  cursor: 'pointer'
});

function titlesLoaded() {

  var timeout = 5000;

  two.trigger('resize').play();

  _.delay(function() {

    intertitles.current = 1;
    _.delay(function() {

      intertitles.current = 2;
      _.delay(function() {

        intertitles.current = 3;
        _.delay(function() {

          two.renderer.domElement.style.display = 'none';
          document.body.removeChild(two.renderer.domElement);
          two.pause();
          document.body.classList.remove('titles');

        }, timeout * 1.5);

      }, timeout);

    }, timeout);

  }, timeout);

  Carolina.init(initialize);

}

function initialize() {

  var noSleep = new NoSleep();

  eye.appendTo(document.querySelector('#content'));

  var loader = document.querySelector('.loader');
  createFades(loader);

  eye.watch().two.play();

  loader.fadeOut(function(){

    createFades(startButton);
    startButton.fadeIn();

    var started = false;

    Carolina.__onEnded = function() {
      startButton.fadeIn(function() {
        Carolina.pause();
      });
      eye.two.play();
      started = false;
      noSleep.disable();
      Carolina.camera.controls.disconnect();
      document.body.classList.add('lobby');
      eye.watch();
    };

    var start = function(e) {

      if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (started) {
        return;
      }

      document.body.classList.remove('lobby');

      noSleep.enable();
      Carolina.camera.controls.connect();

      eye.ignore().blink(function() {

        startButton.fadeOut(function() {

          Carolina.reset({
            elapsed: url.number('startTime', 0)
          });
          started = true;

        });
        eye.two.pause();

      });

      return false;

    };

    startButton.addEventListener('mousedown', start, false);
    startButton.addEventListener('touchstart', start, false);
    // startButton.addEventListener('click', start, false);

  });

}

function createFades(elem) {
  elem.fadeIn = function(callback) {
    elem.style.display = 'block';
    elem.style.opacity = 0;
    _.delay(function() {
      elem.style.opacity = 1;
      _.delay(function() {
        if (_.isFunction(callback)) {
          callback();
        }
      }, 350);
    }, 50);
  };
  elem.fadeOut = function(callback) {
    elem.style.opacity = 0;
    _.delay(function() {
      elem.style.display = 'none';
      if (_.isFunction(callback)) {
        callback();
      }
    }, 350);
  };
}

function createShape() {

  var index = Math.random();
  var amt = 5;
  var shape, phi = Math.floor(Math.random() * 4) + 2;;
  var i, v;

  if (index < 1 / amt) {
    shape = new Two.Rectangle(0, 0, 50, 50);
    for (i = 0; i < shape.vertices.length; i++) {
      v = shape.vertices[i];
      v.origin = new Two.Vector().copy(v);
      v.startTime = Math.random() * 2 * Math.PI;
      v.direction = Math.random() > 0.5 ? -1 : 1;
    }
    shape.update = function(color) {
      shape.noStroke().fill = color;
      shape.rotation = Math.random() * Math.PI * 2;
      shape.translation.set(
        Math.random() * two.width,
        Math.random() * two.height
      );
      shape.scale = 2 * Math.random() + 1;
    };
    return shape;
  }
  if (index < 2 / amt) {
    shape = new Two.Ellipse(0, 0, 25, 25);
    for (i = 0; i < shape.vertices.length; i++) {
      v = shape.vertices[i];
      v.origin = new Two.Vector().copy(v);
      v.startTime = Math.random() * 2 * Math.PI;
      v.direction = Math.random() > 0.5 ? -1 : 1;
    }
    shape.update = function(color) {
      shape.noStroke().fill = color;
      shape.rotation = Math.random() * Math.PI * 2;
      shape.translation.set(
        Math.random() * two.width,
        Math.random() * two.height
      );
      shape.scale = 2 * Math.random() + 1;
    };
    return shape;
  }
  if (index < 3 / amt) {
    shape = new Two.Polygon(0, 0, 25, 3);
    for (i = 0; i < shape.vertices.length; i++) {
      v = shape.vertices[i];
      v.origin = new Two.Vector().copy(v);
      v.startTime = Math.random() * 2 * Math.PI;
      v.direction = Math.random() > 0.5 ? -1 : 1;
    }
    shape.update = function(color) {
      shape.noStroke().fill = color;
      shape.rotation = Math.random() * Math.PI * 2;
      shape.translation.set(
        Math.random() * two.width,
        Math.random() * two.height
      );
      shape.scale = 2 * Math.random() + 1;
    };
    return shape;
  }
  if (index < 4 / amt) {
    shape = new Two.Polygon(0, 0, 25, 6);
    for (i = 0; i < shape.vertices.length; i++) {
      v = shape.vertices[i];
      v.origin = new Two.Vector().copy(v);
      v.startTime = Math.random() * 2 * Math.PI;
      v.direction = Math.random() > 0.5 ? -1 : 1;
    }
    shape.update = function(color) {
      shape.noFill().stroke = color;
      shape.rotation = Math.random() * Math.PI * 2;
      shape.translation.set(
        Math.random() * two.width,
        Math.random() * two.height
      );
      shape.scale = 2 * Math.random() + 1;
    };
    return shape;
  }
  if (index < 5 / amt) {
    shape = new Two.Line(-25, 0, 25, 0);
    for (i = 0; i < shape.vertices.length; i++) {
      v = shape.vertices[i];
      v.origin = new Two.Vector().copy(v);
      v.startTime = Math.random() * 2 * Math.PI;
      v.direction = Math.random() > 0.5 ? -1 : 1;
    }
    shape.update = function(color) {
      shape.noFill().stroke = color;
      shape.rotation = Math.random() * Math.PI * 2;
      shape.translation.set(
        Math.random() * two.width,
        Math.random() * two.height
      );
      shape.scale = 2 * Math.random() + 1;
      shape.cap = 'round';
    };
    return shape;
  }

}