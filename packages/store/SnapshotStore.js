let Err = require('substance').SubstanceError
let isNull = require('lodash/isNull')

/*
  Implements Substance SnapshotStore API.

  For now it's just a fake and using document storage
*/
class SnapshotStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }

  /*
    Get Snapshot by documentId and version. If no version is provided
    the highest version available is returned
    
    @return {Object} snapshot record
  */
  getSnapshot(args, cb) {
    if (!args || !args.documentId) {
      return cb(new Err('InvalidArgumentsError', {
        message: 'args require a documentId'
      }))
    }
    // documentId, data, version, createdAt
    this.db.records.findOne({document_id: args.documentId}, function(err, doc) {
      if (err) {
        return cb(new Err('SnapshotStore.ReadError', {
          cause: err
        }))
      }

      if (!doc) {
        return cb(new Err('SnapshotStore.ReadError', {
          message: 'No snapshot found for documentId ' + args.documentId
        }))
      }

      let snapshot = {
        documentId: doc.document_id,
        version: doc.version,
        data: doc.content,
        createdAt: doc.created
      }

      if(isNull(snapshot.data)) snapshot.version = 0

      cb(null, snapshot)
    })
  }

  /*
    Stores a snapshot for a given documentId and version.

    Please note that an existing snapshot will be overwritten.
  */
  saveSnapshot(args, cb) {
    let record = {
      document_id: args.documentId,
      version: args.version,
      content: args.data,
      full_text: args.fullText
    }

    this.db.records.save(record, function(err, doc) {
      if (err) {
        return cb(new Err('SnapshotStore.CreateError', {
          cause: err
        }))
      }

      let snapshot = {
        documentId: doc.document_id,
        version: doc.version,
        data: doc.content,
        createdAt: doc.created
      }

      cb(null, snapshot)
    })
  }

  /*
    Removes a snapshot for a given documentId + version
  */
  deleteSnaphot(documentId, version, cb) {
    // Fake deletion
    this.getSnapshot({documentId: documentId, version: version}, function(err, snapshot) {
      if (err) {
        return cb(new Err('SnapshotStore.ReadError', {
          cause: err
        }))
      }

      return cb(null, snapshot)
    })
  }

  /*
    Deletes all snapshots for a given documentId
  */
  deleteSnapshotsForDocument(documentId, cb) {
    // Fake deletion
    return cb(null, 1)
  }

  /*
    Returns true if a snapshot exists for a certain version
  */
  snapshotExists(documentId, version, cb) {
    this.db.records.count({documentId: documentId, version: version}, function(err, snapshots) {
      if (err) {
        return cb(new Err('SnapshotStore.ReadError', {
          cause: err,
          info: 'Happened within snapshotExists.'
        }))
      }

      cb(null, snapshots.length > 0)
    })
  }
}

module.exports = SnapshotStore
