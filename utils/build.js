// https://npmjs.org/package/node-minify

var path = require('path');
var compressor = require('node-minify');

var files = [
  path.resolve(__dirname, '../third-party/base64.js'),
  path.resolve(__dirname, '../third-party/tween.js'),
  path.resolve(__dirname, '../third-party/three.js'),
  path.resolve(__dirname, '../third-party/two.js'),
  path.resolve(__dirname, '../third-party/sound.js'),
  path.resolve(__dirname, '../third-party/noise.js'),
  path.resolve(__dirname, '../third-party/xhr.js'),
  path.resolve(__dirname, '../third-party/url.js'),
  path.resolve(__dirname, '../third-party/no-sleep.js'),
  path.resolve(__dirname, '../third-party/device-orientation-controls.js'),
  path.resolve(__dirname, '../third-party/hammer.js'),
  path.resolve(__dirname, '../src/pool.js'),
  path.resolve(__dirname, '../src/path.js'),
  path.resolve(__dirname, '../src/item.js'),
  path.resolve(__dirname, '../src/items/prog.js'),
  path.resolve(__dirname, '../src/items/kick.js'),
  path.resolve(__dirname, '../src/items/perc.js'),
  path.resolve(__dirname, '../src/items/timpani.js'),
  path.resolve(__dirname, '../src/items/bass.js'),
  path.resolve(__dirname, '../src/items/hook.js'),
  path.resolve(__dirname, '../src/items/guitar.js'),
  path.resolve(__dirname, '../src/items/mellotron.js'),
  path.resolve(__dirname, '../src/items/vanguard.js'),
  path.resolve(__dirname, '../src/carolina.js'),
  path.resolve(__dirname, '../src/eye.js'),
  path.resolve(__dirname, '../src/main.js')
];

// Concatenated
new compressor.minify({
  type: 'no-compress',
  fileIn: files,
  fileOut: path.resolve(__dirname, '../build/app.js'),
  callback: function(e) {
    if (!e) {
      console.log('concatenation complete');
    } else {
      console.log('unable to concatenate', e);
    }
  }
});

// Minified
new compressor.minify({
  type: 'uglifyjs',
  fileIn: files,
  fileOut: path.resolve(__dirname, '../build/app.min.js'),
  callback: function(e){
    if (!e) {
      console.log('minified complete');
    } else {
      console.log('unable to minify', e);
    }
  }
});
