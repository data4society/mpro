let Err = require('substance').SubstanceError
let DocumentEngine = require('substance').DocumentEngine
let JSONConverter = require('substance').JSONConverter

/*
  MPro Document Engine API.
*/
class MproDocumentEngine extends DocumentEngine {

  //let _super = MproDocumentEngine.super.prototype;

  /*
    Creates a new empty or prefilled document
    Writes the initial change into the database.
    Returns the JSON serialized version, as a starting point
  */
  createDocument(args, cb) {
    let schemas = this.configurator.getSchemas()
    let schemaConfig = schemas[args.schemaName]
    if (!schemaConfig) {
      return cb(new Err('SchemaNotFoundError', {
        message: 'Schema not found for ' + args.schemaName
      }))
    }

    let converter = new JSONConverter();
    let doc = schemaConfig.createDocument()

    this.documentStore.createDocument({
      schemaName: schemaConfig.name,
      schemaVersion: schemaConfig.version,
      documentId: args.documentId,
      content: converter.exportDocument(doc),
      full_text: '',
      version: 1, // we always start with version 1
      info: args.info
    }, function(err, docRecord) {
      if (err) {
        return cb(new Err('CreateError', {
          cause: err
        }))
      }

      cb(null, docRecord)
    })
  }

  /*
    Get version for given documentId
  */
  getVersion(documentId, cb) {
    this.documentExists(documentId, function(err, exists) {
      if (err || !exists) {
        return cb(new Err('ReadError', {
          message: !exists ? 'Document does not exist' : null,
          cause: err
        }))
      }
      this.documentStore.getDocument(documentId, function(err, doc){
        if(err) return cb(err)
        cb(null, doc.version)
      })
    }.bind(this))
  }

  /*
    Delete document by documentId

    @param {String} documentId document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  deleteDocument(documentId, cb) {
    this.changeStore.deleteChanges(documentId, function(err) {
      if (err) {
        return cb(new Err('DeleteError', {
          cause: err
        }))
      }

      this.documentStore.deleteDocument(documentId, function(err, doc) {
        if (err) {
          return cb(new Err('DeleteError', {
            cause: err
          }))
        }

        cb(null, doc)
      })
    }.bind(this))
  }

  /*
    List documents with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @param {Callback} cb callback
    @returns {Callback}
  */
  listDocuments(filters, options, cb) {
    this.documentStore.listDocuments(filters, options, cb);
  }

  /*
    List themes with top documents using given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @param {Callback} cb callback
    @returns {Callback}
  */
  listThemedDocuments(filters, options, cb) {
    this.documentStore.listThemedDocuments(filters, options, cb);
  }

  /*
    Add change to a given documentId

    args: documentId, change [, documentInfo]
  */
  addChange(args, cb) {
    this.documentExists(args.documentId, function(err, exists) {
      if (err || !exists) {
        return cb(new Err('ReadError', {
          message: !exists ? 'Document does not exist' : null,
          cause: err
        }))
      }
      this.changeStore.addChange(args, function(err, newVersion) {
        if (err) return cb(err);
        // We write the new version to the document store.
        this.documentStore.updateDocument(args.documentId, {
          version: newVersion,
          // Store custom documentInfo
          info: args.documentInfo
        }, function(err) {
          if (err) return cb(err)
          this.snapshotEngine.requestSnapshot(args.documentId, newVersion, function() {
            // no matter if errored or not we will complete the addChange
            // successfully
            cb(null, newVersion)
          })
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }
}

module.exports = MproDocumentEngine
