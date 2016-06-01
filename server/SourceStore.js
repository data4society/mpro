"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Source Store API.
*/
function SourceStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

SourceStore.Prototype = function() {

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  this.seed = function() {
    return new Promise(function(resolve, reject) {
      this.db.seed.sourceSeed(function(err) {
        if (err) {
          return reject(new Err('SourceStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(SourceStore);

module.exports = SourceStore;