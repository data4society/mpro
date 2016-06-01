"use strict";

var SnapshotEngine = require('substance/collab/SnapshotEngine');
var JSONConverter = require('substance/model/JSONConverter');
var Err = require('substance/util/Error');
var converter = new JSONConverter();

/*
  MPro Snapshot Engine module.
*/
function MproSnapshotEngine() {
  MproSnapshotEngine.super.apply(this, arguments);
}

MproSnapshotEngine.Prototype = function() {
  //var _super = MproSnapshotEngine.super.prototype;

  /*
    Creates a snapshot
  */
  this.createSnapshot = function(args, cb) {
    if (!this.snapshotStore) {
      throw new Err('SnapshotStoreRequiredError', {
        message: 'You must provide a snapshot store to be able to create snapshots'
      });
    }

    // option to decrease snapshot version
    args.createRequest = true;

    this._computeSnapshot(args, function(err, snapshot) {
      if (err) return cb(err);
      this.snapshotStore.saveSnapshot(snapshot, cb);
    }.bind(this));
  };

  this._computeSnapshotSmart = function(args, cb) {
    var documentId = args.documentId;
    var version = args.version;
    var docRecord = args.docRecord;
    var doc;

    // snaphot = null if no snapshot has been found
    this.snapshotStore.getSnapshot({
      documentId: documentId,
      version: version,
      findClosest: true
    }, function(err, snapshot) {
      if (err) return cb(err);

      // hack: we're decreasing snapshot version to save
      // actual snapshot in content of document record
      if(args.createRequest && snapshot.version > 0) snapshot.version = snapshot.version - 1;

      if (snapshot && version === snapshot.version) {
        // we alread have a snapshot for this version
        return cb(null, snapshot);
      }

      var knownVersion;
      if (snapshot) {
        knownVersion = snapshot.version;
      } else {
        knownVersion = 0; // we need to fetch all changes
      }

      doc = this._createDocumentInstance(docRecord.schemaName);
      if (snapshot.data) {
        doc = converter.importDocument(doc, snapshot.data);
      }

      // Now we get the remaining changes after the known version
      this.changeStore.getChanges({
        documentId: documentId,
        sinceVersion: knownVersion, // 1
        toVersion: version // 2
      }, function(err, result) {
        if (err) cb(err);
        // Apply remaining changes to the doc
        this._applyChanges(doc, result.changes);
        // doc here should be already restored
        var snapshot = {
          documentId: documentId,
          version: version,
          data: converter.exportDocument(doc)
        };
        cb(null, snapshot);
      }.bind(this));
    }.bind(this));
  };
};

SnapshotEngine.extend(MproSnapshotEngine);

module.exports = MproSnapshotEngine;