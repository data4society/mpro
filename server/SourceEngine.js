"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var map = require('lodash/map');
var Promise = require("bluebird");

/*
  Implements the Source Engine API.
*/
function SourceEngine(config) {
  this.config = config;
  this.gap = config.gap || 1;
  this.sourceStore = config.sourceStore;
  this.documentStore = config.documentStore;

  this.requestConversion();
}

SourceEngine.Prototype = function() {

  /*
    Recurring conversion schedule
  */
  this.scheduleConversion = function() {
    this.interval = setInterval(function(){
      console.log('test');
    }, 60 * 1000 * this.gap); 
  };

  /*
    Reset recurring conversion schedule
  */
  this.resetSchedule = function() {
    clearInterval(this.interval);
    this.scheduleConversion();
  };

  /*
    Conversion flow
  */
  this.requestConversion = function() {
    this.getConversionData()
      .then(function(data){
        // Stop the timer
        clearInterval(this.interval);
        return Promise.map(data, function(sourceId) {
          return this.convert(sourceId);
        }.bind(this), {concurrency: 1});
      }.bind(this))
      .then(function(id) {
        console.log(id, "done");
        // Resume the timer
        this.scheduleConversion();
      }.bind(this))
      .catch(function(err) {
        throw new Err('ConversionError', {
          cause: err
        });
      });
  };

  /*
    Mark document sources as converted
    status 11 means converted sources

    @param {String} sourceId source id
    @returns {Promise}
  */
  this.markDone = function(sourceId) {
    var data = {
      status: 11
    };

    return this.sourceStore.updateSource(sourceId, data);
  };

  /*
    Get document sources for conversion
    status 10 means ready for conversion sources

    @returns {Promise}
  */
  this.getConversionData = function() {
    return new Promise(function(resolve, reject) {
      this.sourceStore.listSources({'status': 10}, {columns: ['doc_id']}).then(function(results) {
        var sources = map(results.records, function(rec) {return rec.doc_id; });
        resolve(sources);
      }).catch(function(err) {
        reject(new Err('SourcesListError', {
          cause: err
        }));
      });
    }.bind(this));
  };

  /*
    Converts document sources to substance documents

    @param {String} sourceId source id
    @returns {Promise}
  */
  // this.convert = function(sourceId) {
  //   return new Promise(function(resolve, reject) {
  //     resolve(sourceId);
  //   }.bind(this));
  // };
};

oo.initClass(SourceEngine);

module.exports = SourceEngine;