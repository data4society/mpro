var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the MPro Engine API.
*/
function MproEngine(config) {
  this.config = config;
  this.thematicStore = config.thematicStore;
}

MproEngine.Prototype = function() {

  /*
    List thematics with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listThematics = function(filters, options) {
    return new Promise(function(resolve, reject) {
      this.thematicStore.listThematics(filters, options).then(function(results) {
        resolve(results);
      }).catch(function(err) {
        reject(new Err('ThematicsListError', {
          cause: err
        }));
      });
    }.bind(this));
  };

};

oo.initClass(MproEngine);

module.exports = MproEngine;