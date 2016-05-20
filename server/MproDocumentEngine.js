var DocumentEngine = require('substance/collab/DocumentEngine');
var Err = require('substance/util/Error');

/*
  MPro Document Engine API.
*/
function MproDocumentEngine() {
  MproDocumentEngine.super.apply(this, arguments);
}

MproDocumentEngine.Prototype = function() {

  //var _super = MproDocumentEngine.super.prototype;

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