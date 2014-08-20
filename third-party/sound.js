(function() {

  var root = this;
  var previousSound = root.Sound || {};
  var callbacks = [], ctx;

  // Force polyfill for Web Audio
  root.addEventListener('load', function() {
    root.AudioContext = root.AudioContext || root.webkitAudioContext;
    Sound._ready = true;
    try {
      Sound.ctx = ctx = new root.AudioContext();
      Sound.has = true;
      _.each(callbacks, function(c) {
        c.call(Sound);
      });
    } catch (e) {
      delete Sound.ctx;
      Sound.has = false;
    }
    callbacks.length = 0;
  }, false);

  var Sound = root.Sound = function(url, callback) {

    this.finished = _.bind(function() {
      this.trigger('ended');
    }, this);

    Sound.get(url, _.bind(function(buffer) {

      this.buffer = buffer;
      this._ready = true;
      if (_.isFunction(callback)) {
        callback.call(this);
      }
      this.trigger('load');

    }, this));

  };

  _.extend(Sound, {

    _ready: false,

    ready: function(func) {
      if (Sound._ready) {
        func.call(Sound);
        return;
      }
      callbacks.push(func);
    },

    noConflict: function() {
      root.Sound = previousAudio;
      return this;
    },

    get: function(url, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        ctx.decodeAudioData(request.response, function(buffer) {
          if (_.isFunction(callback)) {
            callback(buffer);
          }
        }, function(e) {
          console.log('Error loading', url, e);
        });
      };
      request.send();
    }

  });

  _.extend(Sound.prototype, Backbone.Events, {

    startTime: 0,
    elapsed: 0,

    stop: function(options) {

      if (!this.source) {
        return this;
      }

      this.elapsed = 0;

      var params = _.defaults(options || {}, {
        time: ctx.currentTime
      });

      console.log(this.source);

      this.source.stop(params.time);
      this.source.disconnect(ctx.destination);
      delete this.source;

      return this;

    },

    pause: function() {

      this.elapsed = ctx.currentTime - this.startTime;

      this.source.stop();
      this.source.disconnect(ctx.destination);
      delete this.source;

      return this;

    },

    play: function(options) {

      var params = _.defaults(options || {}, {
        time: ctx.currentTime,
        elapsed: 0,
        duration: this.buffer.duration,
        loop: false
      });

      this.source = ctx.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(ctx.destination);
      this.source.loop = params.loop;
      this.source.onended = this.finished;

      this.startTime = params.time;
      var elapsed = params.elapsed || this.elapsed;

      if (_.isFunction(this.source.start)) {
        this.source.start(params.time, elapsed, params.duration - elapsed);
      } else if (_.isFunction(this.source.noteOn)) {
        this.source.noteOn(params.time, this.elapsed, params.duration - elapsed);
      }

      return this;

    }

  });

})();