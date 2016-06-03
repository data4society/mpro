"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the MPro Engine API.
*/
function MproEngine(config) {
  this.config = config;
  this.rubricStore = config.rubricStore;
}

MproEngine.Prototype = function() {

  /*
    List rubrics with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listRubrics = function(filters, options) {
    return new Promise(function(resolve, reject) {
      this.rubricStore.listRubrics(filters, options).then(function(results) {
        resolve(results);
      }).catch(function(err) {
        reject(new Err('RubricsListError', {
          cause: err
        }));
      });
    }.bind(this));
  };

};

oo.initClass(MproEngine);

module.exports = MproEngine;