"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/SubstanceError');
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
    List available classes with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listClasses = function(filters, options) {
    var output = {};

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100;

    return new Promise(function(resolve, reject) {

      this.db.entity_classes.count(filters, function(err, count) {
        if (err) {
          reject(new Err('ClassStore.ListError', {
            cause: err
          }));
        }
        output.total = count;
        
        this.db.entity_classes.find(filters, options, function(err, classes) {
          if (err) {
            reject(new Err('ClassStore.ListError', {
              cause: err
            }));
          }

          output.records = classes;
          resolve(output);
        });
      }.bind(this));
    }.bind(this));
  };

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