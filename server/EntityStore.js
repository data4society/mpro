"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the EntityStore API.
*/
function EntityStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

EntityStore.Prototype = function() {

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  this.seed = function() {
    return new Promise(function(resolve, reject) {
      this.db.seed.entitySeed(function(err) {
        if (err) {
          return reject(new Err('EntityStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(EntityStore);

module.exports = EntityStore;