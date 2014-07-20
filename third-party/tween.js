/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {

  Date.now = function () {

    return new Date().valueOf();

  };

}

var TWEEN = TWEEN || ( function () {

  var _tweens = [];

  return {

    clock: ( typeof window !== undefined && window.performance !== undefined && window.performance.now !== undefined ? window.performance : Date ),

    REVISION: '14-br1',

    getAll: function () {

      return _tweens;

    },

    removeAll: function () {

      _tweens.length = 0;

    },

    add: function ( tween ) {

      if (tween.index !== undefined) {
        return;
      }

      tween.index = _tweens.length;
      _tweens.push( tween );

    },

    remove: function ( tween ) {

      if (tween.index === undefined) {
        return;
      }

      _tweens.splice( tween.index, 1 );
      delete tween.index;

    },

    update: function ( time ) {

      if ( _tweens.length === 0 ) return false;

      // var i = 0;

      time = time !== undefined ? time : TWEEN.clock.now();

      for ( var i = 0, l = _tweens.length; i < l; i++ ) {

        _tweens[ i ].update( time );

      }

      return true;

    }
  };

} )();

TWEEN.Tween = function ( object ) {

  var _object = object;
  var _valuesStart = {};
  var _valuesEnd = {};
  var _duration = 1000;
  var _repeat = 0;
  var _isPlaying = false;
  var _delayTime = 0;
  var _startTime = null;
  var _easingFunction = TWEEN.Easing.Linear.None;
  var _onStartCallback = null;
  var _onStartCallbackFired = false;
  var _onUpdateCallback = null;
  var _onCompleteCallback = null;
  var _onStopCallback = null;

  this.to = function ( properties, duration ) {

    if ( duration !== undefined ) {

      _duration = duration;

    }

    _valuesEnd = properties;

    return this;

  };

  this.start = function ( time ) {

    TWEEN.add( this );

    _isPlaying = true;

    _onStartCallbackFired = false;

    _startTime = time !== undefined ? time : TWEEN.clock.now();
    _startTime += _delayTime;

    for ( var property in _valuesEnd ) {

      _valuesStart[ property ] = _object[ property ];

      if ( ( _valuesStart[ property ] instanceof Array ) === false ) {
        _valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
      }

    }

    return this;

  };

  this.stop = function () {

    if ( !_isPlaying ) {
      return this;
    }

    TWEEN.remove( this );
    _isPlaying = false;

    if ( _onStopCallback !== null ) {

      _onStopCallback.call( _object );

    }

    return this;

  };

  this.delay = function ( amount ) {

    _delayTime = amount;
    return this;

  };


  this.easing = function ( easing ) {

    _easingFunction = easing;
    return this;

  };

  this.onStart = function ( callback ) {

    _onStartCallback = callback;
    return this;

  };

  this.onUpdate = function ( callback ) {

    _onUpdateCallback = callback;
    return this;

  };

  this.onComplete = function ( callback ) {

    _onCompleteCallback = callback;
    return this;

  };

  this.onStop = function ( callback ) {

    _onStopCallback = callback;
    return this;

  };

  this.update = function ( time ) {

    var property;

    if ( time < _startTime ) {

      return true;

    }

    if ( _onStartCallbackFired === false ) {

      if ( _onStartCallback !== null ) {

        _onStartCallback.call( _object );

      }

      _onStartCallbackFired = true;

    }

    var elapsed = ( time - _startTime ) / _duration;
    elapsed = elapsed > 1 ? 1 : elapsed;

    var value = _easingFunction( elapsed );

    for ( property in _valuesEnd ) {

      var start = _valuesStart[ property ] || 0;
      var end = _valuesEnd[ property ];

      // Parses relative end values with start as base (e.g.: +10, -3)
      if ( typeof(end) === "string" ) {
        end = start + parseFloat(end, 10);
      }

      // protect against non numeric properties.
      if ( typeof(end) === "number" ) {
        _object[ property ] = start + ( end - start ) * value;
      }

    }

    if ( _onUpdateCallback !== null ) {

      _onUpdateCallback.call( _object, value );

    }

    if ( elapsed == 1 ) {

      if ( _onCompleteCallback !== null ) {

        _onCompleteCallback.call( _object );

      }

      return false;

    }

    return true;

  };

};


TWEEN.Easing = {

  Linear: {

    None: function ( k ) {

      return k;

    }

  },

  Quadratic: {

    In: function ( k ) {

      return k * k;

    },

    Out: function ( k ) {

      return k * ( 2 - k );

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
      return - 0.5 * ( --k * ( k - 2 ) - 1 );

    }

  },

  Cubic: {

    In: function ( k ) {

      return k * k * k;

    },

    Out: function ( k ) {

      return --k * k * k + 1;

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
      return 0.5 * ( ( k -= 2 ) * k * k + 2 );

    }

  },

  Quartic: {

    In: function ( k ) {

      return k * k * k * k;

    },

    Out: function ( k ) {

      return 1 - ( --k * k * k * k );

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
      return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

    }

  },

  Quintic: {

    In: function ( k ) {

      return k * k * k * k * k;

    },

    Out: function ( k ) {

      return --k * k * k * k * k + 1;

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
      return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

    }

  },

  Sinusoidal: {

    In: function ( k ) {

      return 1 - Math.cos( k * Math.PI / 2 );

    },

    Out: function ( k ) {

      return Math.sin( k * Math.PI / 2 );

    },

    InOut: function ( k ) {

      return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

    }

  },

  Exponential: {

    In: function ( k ) {

      return k === 0 ? 0 : Math.pow( 1024, k - 1 );

    },

    Out: function ( k ) {

      return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

    },

    InOut: function ( k ) {

      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
      return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

    }

  },

  Circular: {

    In: function ( k ) {

      return 1 - Math.sqrt( 1 - k * k );

    },

    Out: function ( k ) {

      return Math.sqrt( 1 - ( --k * k ) );

    },

    InOut: function ( k ) {

      if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
      return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

    }

  },

  Elastic: {

    In: function ( k ) {

      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
      return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

    },

    Out: function ( k ) {

      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
      return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

    },

    InOut: function ( k ) {

      var s, a = 0.1, p = 0.4;
      if ( k === 0 ) return 0;
      if ( k === 1 ) return 1;
      if ( !a || a < 1 ) { a = 1; s = p / 4; }
      else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
      if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
      return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

    }

  },

  Back: {

    In: function ( k ) {

      var s = 1.70158;
      return k * k * ( ( s + 1 ) * k - s );

    },

    Out: function ( k ) {

      var s = 1.70158;
      return --k * k * ( ( s + 1 ) * k + s ) + 1;

    },

    InOut: function ( k ) {

      var s = 1.70158 * 1.525;
      if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
      return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

    }

  },

  Bounce: {

    In: function ( k ) {

      return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

    },

    Out: function ( k ) {

      if ( k < ( 1 / 2.75 ) ) {

        return 7.5625 * k * k;

      } else if ( k < ( 2 / 2.75 ) ) {

        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

      } else if ( k < ( 2.5 / 2.75 ) ) {

        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

      } else {

        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

      }

    },

    InOut: function ( k ) {

      if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
      return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

    }

  }

};

TWEEN.Interpolation = {

  Linear: function ( v, k ) {

    var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

    if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
    if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

    return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

  },

  Bezier: function ( v, k ) {

    var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

    for ( i = 0; i <= n; i++ ) {
      b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
    }

    return b;

  },

  CatmullRom: function ( v, k ) {

    var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

    if ( v[ 0 ] === v[ m ] ) {

      if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

      return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

    } else {

      if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
      if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

      return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

    }

  },

  Utils: {

    Linear: function ( p0, p1, t ) {

      return ( p1 - p0 ) * t + p0;

    },

    Bernstein: function ( n , i ) {

      var fc = TWEEN.Interpolation.Utils.Factorial;
      return fc( n ) / fc( i ) / fc( n - i );

    },

    Factorial: ( function () {

      var a = [ 1 ];

      return function ( n ) {

        var s = 1, i;
        if ( a[ n ] ) return a[ n ];
        for ( i = n; i > 1; i-- ) s *= i;
        return a[ n ] = s;

      };

    } )(),

    CatmullRom: function ( p0, p1, p2, p3, t ) {

      var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
      return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

    }

  }

};