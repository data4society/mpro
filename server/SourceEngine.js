"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/SubstanceError');
var map = require('lodash/map');
var each = require('lodash/each');
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
  this.configurator = config.configurator;

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
          // eslint-disable-next-line
          console.log(sources.length + ' new records were converted: ' + ids.join(', '));
        } else {
          // eslint-disable-next-line
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
      status: 1001
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
      status: 1002
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
      this.sourceStore.listSources({'status': 1000}, {columns: ['doc_id'], order: "created asc"}).then(function(results) {
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
      } else if (isEmpty(source.rubric_ids) && source.type !== 'tng') {
        errMsg = 'Document source has no rubrics';
      } else if (!this.configurator.getConfigurator('mpro-' + source.type)) {
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
        var importer = this.configurator.getConfigurator('mpro-' + type).createImporter('html');
        
        if(!importer) {
          throw new Err('SourceEngine.ConvertError', {
            message: 'Unknowned type of source: ' + source.type
          });
        }

        var doc = importer.importDocument(recordBody, source);
        var data = converter.exportDocument(doc);
        var schema = doc.schema;
        var training = source.type === 'tng' ? true: false;
        var meta = doc.get('meta');
        var document = {
          title: meta.title,
          guid: source.guid,
          schema_name: schema.name,
          schema_version: schema.version,
          published: meta.published,
          created: new Date().toJSON(), // should be parsed source.created someday
          edited: new Date().toJSON(),
          training: training,
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

  this.updateSource = function(documentId, sourceData) {
    return this.getSourceId(documentId)
      .then(function(sourceId) {
        // Set new status for accepted training documents
        sourceData.status = 1200;
        return this.sourceStore.updateSource(sourceId, sourceData);
      }.bind(this))
      .then(function(source) {
        return source;
      });
  };

  this.getSourceId = function(documentId) {
    return new Promise(function(resolve, reject) {
      this.documentStore.getDocument(documentId, function(err, doc) {
        if(err) {
          reject(new Err('SourceEngine.GetSourceIdError', {
            cause: err
          }));
        }
        var sourceId = doc.source;
        resolve(sourceId);
      });
    }.bind(this));
  };

  this.convertTrainingDocs = function() {
    return new Promise(function(resolve, reject) {
      this.documentStore.listDocuments({
        "meta->>'accepted'": "true"
      }, {
        columns: ['document_id', 'schema_name', 'schema_version'],
        limit: 1000
      }, function(err, list) {
        if(err) {
          reject(err);
        }
        return Promise.map(list.records, function(record) {
          var documentId = record.documentId;
          return this.convertDoc(documentId).then(function(sourceData) {
            return this.updateSource(documentId, sourceData);
          }.bind(this));
        }.bind(this), {concurrency: 10})
        .then(function(){
          resolve();
        })
        .catch(function(err) {
          reject(new Err('SourceEngine.TrainingDocsConversionError', {
            cause: err
          }));
        });
      }.bind(this));
    }.bind(this));
  };

  this.convertDoc = function(documentId) {
    return new Promise(function(resolve, reject) {
      this.documentStore.getDocument(documentId, function(err, doc) {
        if(err) {
          reject(new Err('SourceEngine.ConvertDocError', {
            cause: err
          }));
        }
        var result = {};
        result.rubric_ids = doc.rubrics;
        var nodes = {};
        each(doc.content.nodes, function(node) {
          nodes[node.id] = node;
        });

        var plain = [];
        each(nodes.body.nodes, function(nodeId) {
          var content = nodes[nodeId].content;
          if(content) {
            plain.push(content);
          }
        });
        plain = plain.join('\n');
        result.stripped = plain;

        resolve(result);
      });
    }.bind(this));
  };
};

oo.initClass(SourceEngine);

module.exports = SourceEngine;