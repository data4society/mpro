"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the SessionStore API.
*/
function SessionStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

SessionStore.Prototype = function() {

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  this.seed = function() {
    return new Promise(function(resolve, reject) {
      this.db.seed.sessionSeed(function(err) {
        if (err) {
          return reject(new Err('SessionStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(SessionStore);

module.exports = SessionStore;