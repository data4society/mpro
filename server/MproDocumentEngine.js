"use strict";

var DocumentEngine = require('substance/collab/DocumentEngine');
var Err = require('substance/util/SubstanceError');

/*
  MPro Document Engine API.
*/
function MproDocumentEngine() {
  MproDocumentEngine.super.apply(this, arguments);
}

MproDocumentEngine.Prototype = function() {

  //var _super = MproDocumentEngine.super.prototype;

  /*
    Creates a new empty or prefilled document
    Writes the initial change into the database.
    Returns the JSON serialized version, as a starting point
  */
  this.createDocument = function(args, cb) {
    var schemaConfig = this.schemas[args.schemaName];
    if (!schemaConfig) {
      return cb(new Err('SchemaNotFoundError', {
        message: 'Schema not found for ' + args.schemaName
      }));
    }

    this.documentStore.createDocument({
      schemaName: schemaConfig.name,
      schemaVersion: schemaConfig.version,
      documentId: args.documentId,
      version: 1, // we always start with version 1
      info: args.info
    }, function(err, docRecord) {
      if (err) {
        return cb(new Err('CreateError', {
          cause: err
        }));
      }

      cb(null, docRecord);
    });
  };

  /*
    Get version for given documentId
  */
  this.getVersion = function(documentId, cb) {
    this.documentExists(documentId, function(err, exists) {
      if (err || !exists) {
        return cb(new Err('ReadError', {
          message: !exists ? 'Document does not exist' : null,
          cause: err
        }));
      }
      this.documentStore.getDocument(documentId, function(err, doc){
        if(err) return cb(err);
        cb(null, doc.version);
      });
    }.bind(this));
  };

  /*
    Delete document by documentId

    @param {String} documentId document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  this.deleteDocument = function(documentId, cb) {
    this.changeStore.deleteChanges(documentId, function(err) {
      if (err) {
        return cb(new Err('DeleteError', {
          cause: err
        }));
      }

      this.documentStore.deleteDocument(documentId, function(err, doc) {
        if (err) {
          return cb(new Err('DeleteError', {
            cause: err
          }));
        }

        cb(null, doc);
      });
    }.bind(this));
  };

  /*
    List documents with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @param {Callback} cb callback
    @returns {Callback}
  */
  this.listDocuments = function(filters, options, cb) {
    this.documentStore.listDocuments(filters, options, cb);
  };
};

DocumentEngine.extend(MproDocumentEngine);

module.exports = MproDocumentEngine;