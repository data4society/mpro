"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the DocumentStore API.
*/
function DocumentStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

DocumentStore.Prototype = function() {

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  this.seed = function() {
    return new Promise(function(resolve, reject) {
      this.db.seed.documentSeed(function(err) {
        if (err) {
          return reject(new Err('DocumentStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(DocumentStore);

module.exports = DocumentStore;