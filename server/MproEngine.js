var oo = require('substance/util/oo');
//var Err = require('substance/util/Error');

/*
  Implements the MPro Engine API.
*/
function MproEngine(config) {
  this.config = config;
  this.db = config.db.connection;
}

MproEngine.Prototype = function() {

  // Custom things will be here

};

oo.initClass(MproEngine);

module.exports = MproEngine;