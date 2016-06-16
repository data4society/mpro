"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var map = require('lodash/map');
var isEmpty = require('lodash/isEmpty');
var Promise = require("bluebird");
var JSONConverter = require('substance/model/JSONConverter');
var converter = new JSONConverter();

/*
  Implements the Source Engine API.
*/
function SourceEngine(config) {
  this.config = config;
  // Gap between new conversion request
  // and end of old one (in minutes)
  this.gap = config.gap || 1;
  // How many records could be converted simultaneously
  this.concurrency = config.concurrency || 5;
  this.sourceStore = config.sourceStore;
  this.documentStore = config.documentStore;
  this.importers = config.importers;

  this.scheduleConversion();
}

SourceEngine.Prototype = function() {

  /*
    Recurring conversion schedule
  */
  this.scheduleConversion = function() {
    this.interval = setInterval(function(){
      this.requestConversion();
    }.bind(this), 60 * 1000 * this.gap);
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
        }.bind(this), {concurrency: this.concurrency});
      }.bind(this))
      .then(function(sources) {
        if(sources.length > 0) {
          var ids = map(sources, function(s) {return s.doc_id; });
          console.log(sources.length + ' new records were converted: ' + ids.join(', '));
        } else {
          console.log('There are no new records for conversion.');
        }
        // Resume the timer
        this.scheduleConversion();
      }.bind(this))
      .catch(function(err) {
        this.scheduleConversion();
        console.error(err);
        throw new Err('SourceEngine.ConversionError', {
          cause: err
        });
      }.bind(this));
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
    Mark document sources as errored
    status 12 means that document source
    didn't pass validation

    @param {String} sourceId source id
    @returns {Promise}
  */
  this.markError = function(sourceId) {
    var data = {
      status: 12
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
      this.sourceStore.listSources({'status': 10}, {columns: ['doc_id'], order: "created asc"}).then(function(results) {
        var sources = map(results.records, function(rec) {return rec.doc_id; });
        resolve(sources);
      }).catch(function(err) {
        reject(new Err('SourceEngine.SourcesListError', {
          cause: err
        }));
      });
    }.bind(this));
  };

  /*
    Performs basic validation of document source

    @param {String} sourceId source id
    @returns {Promise}
  */
  this.validateSource = function(source) {
    var errMsg;

    return new Promise(function(resolve, reject) {
      if(isEmpty(source.doc_source)) {
        errMsg = 'Document source body is empty';
      } else if (isEmpty(source.meta)) {
        errMsg = 'Document source meta is empty';
      } else if (isEmpty(source.rubric_ids)) {
        errMsg = 'Document source has no rubrics';
      } else if (!this.importers[source.type]) {
        errMsg = 'Unknown type of document source: ' + source.type;
      }

      if(errMsg) {
        return this.markError(source.doc_id)
          .then(function() {
            return reject(new Err('SourceEngine.ConversionError', {
              message: errMsg
            }));
          });
      } else {
        resolve(source);
      }
    }.bind(this));
  };

  /*
    Converts document sources to substance documents

    @param {String} sourceId source id
    @returns {Promise}
  */
  this.convert = function(sourceId) {
    return this.sourceStore.getSource(sourceId)
      .then(function(source) {
        return this.validateSource(source);
      }.bind(this))
      .then(function(source) {
        var recordBody = source.doc_source;
        var type = source.type;
        var Importer = this.importers[type];
        
        if(!Importer) {
          throw new Err('SourceEngine.ConvertError', {
            message: 'Unknowned type of source: ' + source.type
          });
        }
        var importer = new Importer();
        var doc = importer.importDocument(recordBody, source);
        var data = converter.exportDocument(doc);
        var schema = doc.schema;
        var meta = doc.get('meta');
        var document = {
          title: meta.title,
          guid: source.guid,
          schema_name: schema.name,
          schema_version: schema.version,
          published: meta.published,
          created: source.created,
          training: false,
          rubrics: meta.rubrics,
          source: sourceId,
          content: data,
          meta: meta
        };

        return new Promise(function(resolve, reject) {
          this.documentStore.createDocument(document, function(err, doc) {
            if (err) {
              return reject(new Err('SourceEngine.CreateDocument', {
                cause: err
              }));
            }
            resolve(doc.documentId);
          });
        }.bind(this));
      }.bind(this))
      .then(function() {
        // Change status of document source record
        return this.markDone(sourceId);
      }.bind(this))
      .catch(function(err) {
        throw new Err('SourceEngine.ConversionError', {
          cause: err
        });
      });
  };
};

oo.initClass(SourceEngine);

module.exports = SourceEngine;