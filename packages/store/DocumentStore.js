let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let each = require('lodash/each')
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Document Store API.
*/
class DocumentStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }

  /*
    Create a new document record

    @param {Object} documentData JSON object
    @param {Callback} cb callback
    @returns {Callback}
  */
  createDocument(props, cb) {

    if (!props.documentId) {
      // We generate a document_id ourselves
      props.document_id = uuid()
    } else {
      props.document_id = props.documentId
    }

    // TODO: pass here all meta properties which
    // could be stored when we create document from configurator
    if(props.info) {
      if(props.info.title) props.title = props.info.title
      if(props.info.training) props.training = props.info.training
      if(props.info.meta) props.meta = props.info.meta
      if(props.info.source_type) props.source_type = props.info.source_type
      if(props.info.schemaName) props.schema_name = props.info.schemaName
      if(props.info.schemaVersion) props.schema_version = props.info.schemaVersion
    }

    let record = {
      document_id: props.document_id,
      guid: props.guid,
      training: props.training || false,
      title: props.title,
      schema_name: props.schema_name || props.schemaName,
      schema_version: props.schema_version || props.schemaVersion,
      version: props.version || 1,
      rubrics: props.rubrics || [],
      entities: props.entities || [],
      published: props.published,
      created: props.created || new Date(),
      edited: props.edited || new Date(),
      source: props.source,
      meta: props.meta || {title: props.title, rubrics: [], entities: []},
      content: props.content,
      info: props.info
    }

    this.documentExists(record.document_id, function(err, exists) {
      if (err) {
        return cb(new Err('DocumentStore.CreateError', {
          cause: err
        }))
      }

      if (exists) {
        return cb(new Err('DocumentStore.CreateError', {
          message: 'Document ' + props.document_id + ' already exists.'
        }))
      }

      this.db.records.insert(record, function(err, doc) {
        if (err) {
          return cb(new Err('DocumentStore.CreateError', {
            cause: err
          }))
        }

        // Set documentId explictly as it will be used by Document Engine
        doc.documentId = doc.document_id
        // Set schemaName and schemaVersion explictly as it will be used by Snapshot Engine
        doc.schemaName = doc.schema_name
        doc.schemaVersion = doc.schema_version

        cb(null, doc)
      })
    }.bind(this))
  }

  /*
    Get document record for a given documentId

    @param {String} documentId document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  getDocument(documentId, cb) {
    this.db.records.findOne({document_id: documentId}, function(err, doc) {
      if (err) {
        return cb(new Err('DocumentStore.ReadError', {
          cause: err
        }))
      }

      if (!doc) {
        return cb(new Err('DocumentStore.ReadError', {
          message: 'No document found for documentId ' + documentId
        }))
      }

      // Set documentId explictly as it will be used by Document Engine
      doc.documentId = doc.document_id
      // Set schemaName and schemaVersion explictly as it will be used by Snapshot Engine
      doc.schemaName = doc.schema_name
      doc.schemaVersion = doc.schema_version

      cb(null, doc)
    })
  }

  /*
    Update a document record with given props

    @param {String} documentId document id
    @param {Object} props properties to update
    @param {Callback} cb callback
    @returns {Callback}
  */
  updateDocument(documentId, props, cb) {
    
    if(props.info) {
      // TODO: update here all meta properties from document 
      // which could possibly updated
      if(!isUndefined(props.info.title)) props.title = props.info.title
      if(props.info.meta) props.meta = props.info.meta
      if(props.info.rubrics) props.rubrics = props.info.rubrics
      if(props.info.entities) props.entities = props.info.entities
    }

    if(isUndefined(props.edited)) props.edited = new Date()

    this.documentExists(documentId, function(err, exists) {
      if (err) {
        return cb(new Err('DocumentStore.UpdateError', {
          cause: err
        }))
      }

      if (!exists) {
        return cb(new Err('DocumentStore.UpdateError', {
          message: 'Document with documentId ' + documentId + ' does not exists'
        }))
      }

      let documentData = props
      documentData.document_id = documentId

      this.db.records.save(documentData, function(err, doc) {
        if (err) {
          return cb(new Err('DocumentStore.UpdateError', {
            cause: err
          }))
        }

        // Set documentId explictly as it will be used by Document Engine
        doc.documentId = doc.document_id
        // Set schemaName and schemaVersion explictly as it will be used by Snapshot Engine
        doc.schemaName = doc.schema_name
        doc.schemaVersion = doc.schema_version

        cb(null, doc)
      })
    }.bind(this))
  }

  /*
    Remove a document from the db

    @param {String} documentId document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  deleteDocument(documentId, cb) {
    this.documentExists(documentId, function(err, exists) {
      if (err) {
        return cb(new Err('DocumentStore.DeleteError', {
          cause: err
        }))
      }

      if (!exists) {
        return cb(new Err('DocumentStore.DeleteError', {
          message: 'Document with documentId ' + documentId + ' does not exists'
        }))
      }

      this.db.records.destroy({document_id: documentId}, function(err, doc) {
        if (err) {
          return cb(new Err('DocumentStore.DeleteError', {
            cause: err
          }))
        }
        doc = doc[0]
        
        // Set documentId explictly as it will be used by Document Engine
        doc.documentId = doc.document_id
        // Set schemaName and schemaVersion explictly as it will be used by Snapshot Engine
        doc.schemaName = doc.schema_name
        doc.schemaVersion = doc.schema_version

        cb(null, doc)
      })
    }.bind(this))
  }

  /*
    Check if document exists

    @param {String} documentId document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  documentExists(documentId, cb) {
    this.db.records.findOne({document_id: documentId}, function(err, doc) {
      if (err) {
        return cb(new Err('DocumentStore.ReadError', {
          cause: err,
          info: 'Happened within documentExists.'
        }))
      }

      cb(null, !isUndefined(doc))
    })
  }

  /*
    List available documents with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @param {Callback} cb callback
    @returns {Callback}
  */
  listDocuments(filters, options, cb) {
    let output = {}

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100
    if(!options.columns) {
      options.columns = [
        'document_id', 'guid', 'title', 'schema_name', 'schema_version', 'published', 'created', 'edited', 'edited_by', 'rubrics', 'meta'
      ]
    }

    this.db.records.count(filters, function(err, count) {
      if (err) {
        return cb(new Err('DocumentStore.ListError', {
          cause: err
        }))
      }
      output.total = count
      
      this.db.records.find(filters, options, function(err, docs) {
        if (err) {
          return cb(new Err('DocumentStore.ListError', {
            cause: err
          }))
        }

        each(docs, function(doc) {
          // Set documentId explictly as it will be used by Document Engine
          doc.documentId = doc.document_id
          // Set schemaName and schemaVersion explictly as it will be used by Snapshot Engine
          doc.schemaName = doc.schema_name
          doc.schemaVersion = doc.schema_version
        })

        output.records = docs
        cb(null, output)
      })
    }.bind(this))
  }

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  seed() {
    return new Promise(function(resolve, reject) {
      this.db.seed.documentSeed(function(err) {
        if (err) {
          return reject(new Err('DocumentStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = DocumentStore
