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