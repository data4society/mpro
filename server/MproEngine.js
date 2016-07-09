"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/SubstanceError');
var Promise = require("bluebird");

/*
  Implements the MPro Engine API.
*/
function MproEngine(config) {
  this.config = config;
  this.rubricStore = config.rubricStore;
  this.classStore = config.classStore;
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

  /*
    List entity classes with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listClasses = function(filters, options) {
    return new Promise(function(resolve, reject) {
      this.classStore.listClasses(filters, options).then(function(results) {
        resolve(results);
      }).catch(function(err) {
        reject(new Err('ImportEngine.listEntityClassesError', {
          cause: err
        }));
      });
    }.bind(this));
  };

  /*
    List facets for given rubrics

    @param {Array} facets facets
    @returns {Promise}
  */
  this.listFacets = function(facets, training) {
    return new Promise(function(resolve, reject) {
      this.rubricStore.listFacets(facets, training).then(function(results) {
        resolve(results);
      }).catch(function(err) {
        reject(new Err('RubricsFacetsError', {
          cause: err
        }));
      });
    }.bind(this));
  };

};

oo.initClass(MproEngine);

module.exports = MproEngine;