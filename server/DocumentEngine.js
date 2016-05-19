"use strict";

var EventEmitter = require('substance/util/EventEmitter');
var JSONConverter = require('substance/model/JSONConverter');
var Err = require('substance/util/Error');
var SnapshotEngine = require('substance/collab/SnapshotEngine');

/*
  Document Engine API.
*/
function DocumentEngine(config) {
  DocumentEngine.super.apply(this);

  this.schemas = config.schemas;

  // Where changes are stored
  this.documentStore = config.documentStore;
  this.changeStore = config.changeStore;

  // SnapshotEngine instance is required
  this.snapshotEngine = config.snapshotEngine || new SnapshotEngine({
    schemas: this.schemas,
    documentStore: this.documentStore,
    changeStore: this.changeStore
  });
}

DocumentEngine.Prototype = function() {

  /*
    Creates a new empty or prefilled document
  
    Writes the initial change into the database.
    Returns the JSON serialized version, as a starting point

    @param {Object} args arguments
    @param {String} args.documentId document id
    @param {String} args.schemaName schema name
    @param {Object} args.info JSON info object with data
    @returns {Callback} callback
  */
  this.createDocument = function(args, cb) {
    var schemaConfig = this.schemas[args.schemaName];
    if (!schemaConfig) {
      return cb(new Err('SchemaNotFoundError', {
        message: 'Schema not found for ' + args.schemaName
      }));
    }
    var docFactory = schemaConfig.documentFactory;
    var doc = docFactory.createArticle();
    var change = docFactory.createChangeset()[0];
    var createdDocument;
    
    // HACK: we use the info object for the change as well, however
    // we should be able to control this separately.
    change.info = args.info;

    this.documentStore.createDocument({
      schemaName: schemaConfig.name,
      schemaVersion: schemaConfig.version,
      documentId: args.documentId,
      version: 1, // we always start with version 1
      info: args.info
    }).bind(this).then(function(docRecord) {
      createdDocument = docRecord;
      return this.changeStore.addChange({
        documentId: docRecord.documentId,
        change: change
      });
    }).then(function() {
      var converter = new JSONConverter();
      return cb(null, {
        documentId: createdDocument.documentId,
        data: converter.exportDocument(doc),
        version: 1
      });
    }).catch(function(err) {
      console.log(err);
      return cb(new Err('CreateError', {
        cause: err
      }));
    });
  };

  /*
    Get a document snapshot

    @param {Object} args arguments
    @param {String} args.documentId document id
    @param {Number} args.version document version
    @returns {Callback} callback
  */
  this.getDocument = function(args, cb) {
    this.snapshotEngine.getSnapshot(args, cb);
  };

  /*
    Delete a document by documentId

    @param {String} documentId document id
    @returns {Callback} callback
  */
  this.deleteDocument = function(documentId, cb) {
    var deletedDoc;

    return this.documentStore.deleteDocument(documentId).bind(this)
      .then(function(doc) {
        deletedDoc = doc;
        return this.changeStore.deleteChanges(documentId);
      }).then(function() {
        return cb(null, deletedDoc);
      }).catch(function(err) {
        return cb(new Err('DeleteError', {
          cause: err
        }));
      });
  };

  /*
    Check if a given document exists

    @param {String} documentId document id
    @returns {Callback} callback
  */
  this.documentExists = function(documentId, cb) {
    return this.documentStore.documentExists(documentId)
      .then(function(exists) {
        return cb(null, exists);
      }).catch(function(err) {
        return cb(err);
      });
  };

  /*
    Get changes based on documentId, sinceVersion

    @param {Object} args arguments
    @param {String} args.documentId document id
    @returns {Callback} callback
  */
  this.getChanges = function(args, cb) {
    this.documentExists(args.documentId, function(err, exists) {
      if (err || !exists) {
        return cb(new Err('ReadError', {
          message: !exists ? 'Document does not exist' : null,
          cause: err
        }));
      }
      this.changeStore.getChanges(args, cb);  
    }.bind(this));
  };

  /*
    Get version for given documentId

    @param {String} documentId document id
    @returns {Callback} callback
  */
  this.getVersion = function(documentId, cb) {
    this.documentExists(documentId, function(err, exists) {
      if (err || !exists) {
        return cb(new Err('ReadError', {
          message: !exists ? 'Document does not exist' : null,
          cause: err
        }));
      }
      this.changeStore.getVersion(documentId, cb);
    }.bind(this));
  };

  /*
    Add change to a given documentId

    @param {Object} args arguments
    @param {String} args.documentId document id
    @param {Object} args.change JSON object
    @param {String} args.documentInfo info object
    @returns {Callback} callback
  */
  this.addChange = function(args, cb) {
    this.documentExists(args.documentId, function(err, exists) {
      if (err || !exists) {
        return cb(new Err('ReadError', {
          message: !exists ? 'Document does not exist' : null,
          cause: err
        }));
      }

      var version;

      return this.changeStore.addChange(args)
        .then(function(newVersion) {
          
          version = newVersion;

          return this.documentStore.updateDocument(args.documentId, {
            version: newVersion,
            // Store custom documentInfo
            info: args.documentInfo
          }.bind(this));
        }).then(function() {
          return this.snapshotEngine.requestSnapshot(args.documentId);
        }).then(function() {
          return cb(null, version);
        }).catch(function(err) {
          return cb(new Err('CreateChangeError', {
            cause: err
          }));
        });
    }.bind(this)); 
  };

};

EventEmitter.extend(DocumentEngine);
module.exports = DocumentEngine;