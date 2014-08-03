/**
 * @jonobr1 / http://jonobr1.com/
 */

(function() {

  var root = this;
  var previousPool = root.Pool || {};

  var Pool = root.Pool = function(list) {

    this.index = 0;
    this.list = list;

  };

  _.extend(Pool.prototype, {

  });

  Object.defineProperty(Pool.prototype, 'active', {

    get: function() {
      var active = this.list[this.index]; 
      this.index = (this.index + 1) % this.list.length;
      return active;
    }

  });

})();