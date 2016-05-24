'use strict';

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');

/*
  Implements Substance SnapshotStore API.

  For now it's just a fake and using document storage
*/
function SnapshotStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

SnapshotStore.Prototype = function() {


  /*
    Get Snapshot by documentId and version. If no version is provided
    the highest version available is returned
    
    @return {Object} snapshot record
  */
  this.getSnapshot = function(args, cb) {
    if (!args || !args.documentId) {
      return cb(new Err('InvalidArgumentsError', {
        message: 'args require a documentId'
      }));
    }
    // documentId, data, version, createdAt
    this.db.documents.findOne({document_id: args.documentId}, function(err, doc) {
      if (err) {
        return cb(new Err('SnapshotStore.ReadError', {
          cause: err
        }));
      }

      if (!doc) {
        return cb(new Err('SnapshotStore.ReadError', {
          message: 'No snapshot found for documentId ' + args.documentId
        }));
      }

      var snapshot = {
        documentId: doc.document_id,
        version: doc.version,
        data: doc.content,
        createdAt: doc.created
      };

      cb(null, snapshot);
    });
  };

  /*
    Stores a snapshot for a given documentId and version.

    Please note that an existing snapshot will be overwritten.
  */
  this.saveSnapshot = function(args, cb) {
    var record = {
      document_id: args.documentId,
      version: args.version,
      content: args.data
    };

    this.db.documents.save(record, function(err, doc) {
      if (err) {
        return cb(new Err('SnapshotStore.CreateError', {
          cause: err
        }));
      }

      var snapshot = {
        documentId: doc.document_id,
        version: doc.version,
        data: doc.content,
        createdAt: doc.created
      };

      cb(null, snapshot);
    });
  };

  /*
    Removes a snapshot for a given documentId + version
  */
  this.deleteSnaphot = function(documentId, version, cb) {
    // Fake deletion
    this.getSnapshot({documentId: documentId, version: version}, function(err, snapshot) {
      if (err) return cb(new Err('SnapshotStore.ReadError', {
        cause: err
      }));

      return cb(null, snapshot);
    });
  };

  /*
    Deletes all snapshots for a given documentId
  */
  this.deleteSnapshotsForDocument = function(documentId, cb) {
    // Fake deletion
    return cb(null, 1);
  };

  /*
    Returns true if a snapshot exists for a certain version
  */
  this.snapshotExists = function(documentId, version, cb) {
    this.db.documents.count({documentId: documentId, version: version}, function(err, snapshots) {
      if (err) {
        return cb(new Err('SnapshotStore.ReadError', {
          cause: err,
          info: 'Happened within snapshotExists.'
        }));
      }

      cb(null, snapshots.length > 0);
    });
  };
};


oo.initClass(SnapshotStore);
module.exports = SnapshotStore;