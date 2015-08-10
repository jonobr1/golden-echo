/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author jonobr1 / http://jonobr1.com/
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function ( object ) {

  var scope = this;

  this.object = object;
  this.object.rotation.reorder( "YXZ" );

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alpha = 0;
  this.beta = 0;
  this.gamma = 0;

  var onDeviceOrientationChangeEvent = function ( event ) {

    scope.deviceOrientation = event;

  };

  var onScreenOrientationChangeEvent = function () {

    scope.screenOrientation = window.orientation || 0;

  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = function () {

    var zee = new THREE.Vector3( 0, 0, 1 );

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma, orient ) {

      euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler( euler );                               // orient the device

      quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

      quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

    }

  }();

  this.connect = function() {

    onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = true;
    scope.init = true;

    setObjectQuaternion(
      scope.object.quaternion,
      Math.PI,
      Math.PI / 2,
      0,
      0
    );

  };

  this.disconnect = function() {

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.enabled = false;
    scope.init = false;

  };

  this.update = function () {

    if ( scope.enabled === false ) return;

    var alpha  = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 0; // Z
    var beta   = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta  ) : 0; // X'
    var gamma  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
    var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O

    if (scope.init) {
      scope.alpha = alpha;
      scope.beta = beta;
      scope.gamma = gamma;
      scope.init = false;
    }

    setObjectQuaternion(
      scope.object.quaternion,
      (alpha - scope.alpha) + Math.PI,
      (beta - scope.beta) + Math.PI / 2,
      (gamma - scope.gamma) + 0,
      orient
    );

    return this;

  };

  // this.connect();

};
