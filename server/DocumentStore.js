"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Document Store API.
*/
function DocumentStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

DocumentStore.Prototype = function() {

  /*
    Create a new document record

    @param {Object} documentData JSON object
    @returns {Promise}
  */
  this.createDocument = function(props) {

    if (!props.document_id) {
      // We generate a document_id ourselves
      props.document_id = uuid();
    }

    // TODO: pass here all meta properties which
    // could be stored when we create document from configurator
    if(props.info) {
      if(props.info.title) props.title = props.info.title;
      if(props.info.schemaName) props.schema_name = props.info.schemaName;
      if(props.info.schemaVersion) props.schema_version = props.info.schemaVersion;
    }

    var record = {
      document_id: props.document_id,
      guid: props.guid,
      title: props.title,
      schema_name: props.schema_name,
      schema_version: props.schema_version,
      version: props.version || 1,
      issue_date: props.issue_date,
      created: new Date(),
      state: props.state,
      source: props.source,
      stripped: props.stripped,
      meta: props.meta,
      content: props.content,
      info: props.info
    };

    return this.documentExists(props.document_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('DocumentStore.UpdateError', {
            message: 'Document ' + props.document_id + ' already exists.'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.documents.insert(record, function(err, doc) {
            if (err) {
              reject(new Err('DocumentStore.CreateError', {
                cause: err
              }));
            }

            // Set documentId explictly as it will be used by engine
            doc.documentId = doc.document_id;
            
            resolve(doc);
          });
        }.bind(this));
      });
  };

  /*
    Get document record for a given documentId

    @param {String} documentId document id
    @returns {Promise}
  */
  this.getDocument = function(documentId) {
    return new Promise(function(resolve, reject) {
      this.db.documents.findOne({document_id: documentId}, function(err, doc) {
        if (err) {
          reject(new Err('DocumentStore.ReadError', {
            cause: err
          }));
        }

        if (!doc) {
          reject(new Err('DocumentStore.ReadError', {
            message: 'No document found for document_id ' + documentId
          }));
        }

        resolve(doc);
      });
    }.bind(this));
  };

  /*
    Update a document record with given props

    @param {String} documentId document id
    @param {Object} props properties to update
    @returns {Promise}
  */
  this.updateDocument = function(documentId, props) {
    
    if(props.info) {
      // TODO: update here all meta properties from document 
      // which could possibly updated
      if(props.info.title) props.title = props.info.title;
      if(props.info.meta) props.meta = props.info.meta;
    }

    return this.documentExists(documentId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('DocumentStore.UpdateError', {
            message: 'Document with document_id ' + documentId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          var documentData = props;
          documentData.document_id = documentId;

          this.db.documents.save(documentData, function(err, doc) {
            if (err) {
              reject(new Err('DocumentStore.UpdateError', {
                cause: err
              }));
            }

            resolve(doc);
          });
        }.bind(this));
      });
  };

  /*
    Remove a document from the db

    @param {String} documentId document id
    @returns {Promise}
  */
  this.deleteDocument = function(documentId) {
    return this.documentExists(documentId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('DocumentStore.DeleteError', {
            message: 'Document with document_id ' + documentId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.documents.destroy({document_id: documentId}, function(err, doc) {
            if (err) {
              reject(new Err('DocumentStore.DeleteError', {
                cause: err
              }));
            }
            doc = doc[0];
            resolve(doc);
          });
        }.bind(this));
      });
  };

  /*
    Check if document exists

    @param {String} documentId document id
    @returns {Promise}
  */
  this.documentExists = function(documentId) {
    return new Promise(function(resolve, reject) {
      this.db.documents.findOne({document_id: documentId}, function(err, doc) {
        if (err) {
          reject(new Err('DocumentStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(doc));
      });
    }.bind(this));
  };

  /*
    List available documents with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listDocuments = function(filters, options) {
    var output = {};

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100;

    return new Promise(function(resolve, reject) {
      this.db.documents.count(filters, function(err, count) {
        if (err) {
          reject(new Err('DocumentStore.ListError', {
            cause: err
          }));
        }
        output.total = count;
        
        this.db.documents.find(filters, options, function(err, docs) {
          if (err) {
            reject(new Err('DocumentStore.ListError', {
              cause: err
            }));
          }

          output.records = docs;
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