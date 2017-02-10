let SnapshotEngine = require('substance').SnapshotEngine
let JSONConverter = require('substance').JSONConverter
let Err = require('substance').SubstanceError
let each = require('lodash/each')

let converter = new JSONConverter()

/*
  MPro Snapshot Engine module.
*/
class MproSnapshotEngine extends SnapshotEngine {

  /*
    Creates a snapshot
  */
  createSnapshot(args, cb) {
    if (!this.snapshotStore) {
      throw new Err('SnapshotStoreRequiredError', {
        message: 'You must provide a snapshot store to be able to create snapshots'
      })
    }

    // option to decrease snapshot version
    args.createRequest = true

    this._computeSnapshot(args, function(err, snapshot) {
      if (err) return cb(err)
      this.snapshotStore.saveSnapshot(snapshot, cb)
    }.bind(this))
  }

  _computeSnapshotSmart(args, cb) {
    let documentId = args.documentId
    let version = args.version
    let docRecord = args.docRecord
    let doc

    // snaphot = null if no snapshot has been found
    this.snapshotStore.getSnapshot({
      documentId: documentId,
      version: version,
      findClosest: true
    }, function(err, snapshot) {
      if (err) return cb(err)

      // hack: we're decreasing snapshot version to save
      // actual snapshot in content of document record
      if(args.createRequest && snapshot.version > 0) snapshot.version = snapshot.version - 1

      if (snapshot && version === snapshot.version) {
        // we alread have a snapshot for this version
        return cb(null, snapshot)
      }

      let knownVersion
      if (snapshot) {
        knownVersion = snapshot.version
      } else {
        knownVersion = 0 // we need to fetch all changes
      }

      doc = this._createDocumentInstance(docRecord.schemaName)
      if (snapshot.data) {
        doc = converter.importDocument(doc, snapshot.data)
      }

      // Now we get the remaining changes after the known version
      this.changeStore.getChanges({
        documentId: documentId,
        sinceVersion: knownVersion, // 1
        toVersion: version // 2
      }, function(err, result) {
        if (err) cb(err)
        // Apply remaining changes to the doc
        this._applyChanges(doc, result.changes)
        // doc here should be already restored
        let snapshot = {
          documentId: documentId,
          version: version,
          data: converter.exportDocument(doc),
          fullText: this._getFullText(doc)
        }
        cb(null, snapshot)
      }.bind(this))
    }.bind(this))
  }

  /*
    Based on a given schema create a document instance based
    on given schema configuration
  */
  _createDocumentInstance(schemaName) {
    let subConfig = this.configurator.getConfigurator(schemaName)

    if (!subConfig) {
      throw new Err('SnapshotEngine.SchemaNotFoundError', {
        message:'Schema ' + schemaName + ' not found'
      })
    }
    let doc = subConfig.createArticle()
    return doc
  }

  /*
    Get plain text version of document
  */
  _getFullText(doc) {
    let body = doc.get('body')
    let fullText = ''

    each(body.nodes, function(nodeId) {
      fullText += '\r\n' + doc.get(nodeId).content
    })

    return fullText
  }
}

module.exports = MproSnapshotEngine
