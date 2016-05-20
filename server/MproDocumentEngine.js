var DocumentEngine = require('substance/collab/DocumentEngine');
var Err = require('substance/util/Error');

/*
  MPro Document Engine API.
*/
function MproDocumentEngine(config) {
  MproDocumentEngine.super.apply(this, arguments);
}

MproDocumentEngine.Prototype = function() {

  var _super = MproDocumentEngine.super.prototype;

  /*
    Delete document by documentId
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
};

DocumentEngine.extend(MproDocumentEngine);

module.exports = MproDocumentEngine;