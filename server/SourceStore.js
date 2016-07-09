"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/SubstanceError');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Document Source Store API.
*/
function SourceStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

SourceStore.Prototype = function() {

  /*
    Create a new document source entry

    @param {Object} sourceData JSON object
    @returns {Promise}
  */
  this.createSource = function(sourceData) {
    // Generate a doc_id if not provided
    if (!sourceData.doc_id) {
      sourceData.doc_id = uuid();
    }

    if (!sourceData.guid) {
      sourceData.guid = sourceData.doc_id;
    }

    return this.sourceExists(sourceData.doc_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('SourceStore.CreateError', {
            message: 'Document source ' + sourceData.doc_id + ' already exists.'
          });
        }

        return this._createSource(sourceData);
      });
  };

  /*
    Get document source record for a given sourceId

    @param {String} doc_id source id
    @returns {Promise}
  */
  this.getSource = function(sourceId) {
    return new Promise(function(resolve, reject) {
      this.db.documents.findOne({doc_id: sourceId}, function(err, source) {
        if (err) {
          reject(new Err('SourceStore.ReadError', {
            cause: err
          }));
        }

        if (!source) {
          reject(new Err('SourceStore.ReadError', {
            message: 'No document source found for doc_id ' + sourceId
          }));
        }

        resolve(source);
      });
    }.bind(this));
  };

  /*
    Update a document source record with given props

    @param {String} sourceId source id
    @param {Object} props properties to update
    @returns {Promise}
  */
  this.updateSource = function(sourceId, props) {
    return this.sourceExists(sourceId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('SourceStore.UpdateError', {
            message: 'Document source with doc_id ' + sourceId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          var sourceData = props;
          sourceData.doc_id = sourceId;

          this.db.documents.save(sourceData, function(err, source) {
            if (err) {
              reject(new Err('SourceStore.UpdateError', {
                cause: err
              }));
            }

            resolve(source);
          });
        }.bind(this));
      });
  };

  /*
    Remove a source from the db

    @param {String} sourceId source id
    @returns {Promise}
  */
  this.deleteSource = function(sourceId) {
    return this.sourceExists(sourceId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('SourceStore.DeleteError', {
            message: 'Document source with doc_id ' + sourceId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.documents.destroy({doc_id: sourceId}, function(err, source) {
            if (err) {
              reject(new Err('SourceStore.DeleteError', {
                cause: err
              }));
            }
            source = source[0];
            resolve(source);
          });
        }.bind(this));
      });
  };

  /*
    Internal method to create a document source entry

    @param {Object} rubricData JSON object
    @returns {Promise}
  */
  this._createSource = function(sourceData) {

    var record = {
      doc_id: sourceData.doc_id,
      guid: sourceData.guid,
      created: new Date(),
      title: sourceData.title,
      doc_source: sourceData.doc_source,
      stripped: sourceData.stripped,
      status: sourceData.status,
      published_date: sourceData.published_date,
      rubric_ids: sourceData.rubric_ids,
      type: sourceData.type
    };

    return new Promise(function(resolve, reject) {
      this.db.documents.insert(record, function(err, source) {
        if (err) {
          reject(new Err('SourceStore.CreateError', {
            cause: err
          }));
        }

        resolve(source);
      });
    }.bind(this));
  };

  /*
    Check if document source exists

    @param {String} sourceId source id
    @returns {Promise}
  */
  this.sourceExists = function(sourceId) {
    return new Promise(function(resolve, reject) {
      this.db.documents.findOne({doc_id: sourceId}, function(err, source) {
        if (err) {
          reject(new Err('SourceStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(source));
      });
    }.bind(this));
  };

  /*
    List available document sources with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listSources = function(filters, options) {
    var output = {};

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100;

    return new Promise(function(resolve, reject) {

      this.db.documents.count(filters, function(err, count) {
        if (err) {
          reject(new Err('SourceStore.ListError', {
            cause: err
          }));
        }
        output.total = count;
        
        this.db.documents.find(filters, options, function(err, sources) {
          if (err) {
            reject(new Err('SourceStore.ListError', {
              cause: err
            }));
          }

          output.records = sources;
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