"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the Entity Class Store API.
*/
function ClassStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

ClassStore.Prototype = function() {

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  this.seed = function() {
    return new Promise(function(resolve, reject) {
      this.db.seed.classSeed(function(err) {
        if (err) {
          return reject(new Err('ClassStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };


};

oo.initClass(ClassStore);

module.exports = ClassStore;