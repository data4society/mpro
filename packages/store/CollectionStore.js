let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let extend = require('lodash/extend')
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Collection Store API.
*/
class CollectionStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }
 
  /*
    Create a new collection

    @param {Object} collectionData JSON object
    @returns {Promise}
  */
  createCollection(collectionData) {
    // Generate an collection_id if not provided
    if (!collectionData.collection_id) {
      collectionData.collection_id = uuid()
    }

    if (isUndefined(collectionData.name)) {
      collectionData.name = ''
    }

    if (isUndefined(collectionData.data)) {
      collectionData.data = {}
    }

    return this.collectionExists(collectionData.collection_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('CollectionStore.CreateError', {
            message: 'Collection ' + collectionData.collection_id + ' already exists.'
          })
        }

        return this._createcollection(collectionData)
      }.bind(this))
  }

  /*
    Get collection record for a given collectionId

    @param {String} collectionId collection id
    @returns {Promise}
  */
  getCollection(collectionId) {
    return new Promise(function(resolve, reject) {
      this.db.collections.findOne({collection_id: collectionId}, function(err, collection) {
        if (err) {
          reject(new Err('CollectionStore.ReadError', {
            cause: err
          }))
        }

        if (!collection) {
          reject(new Err('CollectionStore.ReadError', {
            message: 'No collection found for collection_id ' + collectionId
          }))
        }

        resolve(collection)
      })
    }.bind(this))
  }

  /*
    Update an collection record with given props

    @param {String} collectionId collection id
    @param {Object} props properties to update
    @returns {Promise}
  */
  updateCollection(collectionId, props) {
    props.edited = new Date()

    return this.collectionExists(collectionId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('CollectionStore.UpdateError', {
            message: 'Collection with collection_id ' + collectionId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          let collectionData = props
          collectionData.collection_id = collectionId

          this.db.collections.save(collectionData, function(err, collection) {
            if (err) {
              reject(new Err('CollectionStore.UpdateError', {
                cause: err
              }))
            }

            resolve(collection)
          })
        }.bind(this))
      }.bind(this));
  }

  /*
    Remove an collection from the db

    @param {String} collectionId collection id
    @returns {Promise}
  */
  deleteCollection(collectionId) {
    return this.collectionExists(collectionId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('CollectionStore.DeleteError', {
            message: 'Collection with collection_id ' + collectionId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          this.db.collections.destroy({collection_id: collectionId}, function(err, collection) {
            if (err) {
              reject(new Err('CollectionStore.DeleteError', {
                cause: err
              }))
            }
            collection = collection[0]
            resolve(collection)
          })
        }.bind(this))
      }.bind(this))
  }

  listCollections(filters, options) {
    let output = {}

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100
    if(!options.columns) options.columns = ['collection_id', 'name', 'created', 'edited', 'author', 'description']

    return new Promise(function(resolve, reject) {
      this.db.collections.count(filters, function(err, count) {
        if (err) {
          return reject(new Err('CollectionStore.ListError', {
            cause: err
          }))
        }
        output.total = count
        
        this.db.collections.find(filters, options, function(err, collections) {
          if (err) {
            return reject(new Err('CollectionStore.ListError', {
              cause: err
            }))
          }
          output.records = collections
          
          resolve(output)
        })
      }.bind(this))
    }.bind(this))
  }


  /*
    Quick find an collection from the db using string matching

    @param {String} pattern pattern to match
    @param {String} restrictions query restrictions
    @returns {Promise}
  */
  findCollection(pattern, restrictions) {
    return new Promise(function(resolve, reject) {
      let query = extend({'name ilike': '%' + pattern + '%'}, restrictions)
      this.db.collections.find(
        query,
        {columns: ['collection_id', 'name'], limit: 10},
        function(err, collections) {
          if (err) {
            reject(new Err('CollectionStore.FindError', {
              cause: err
            }))
          }
          resolve(collections)
        }
      )
    }.bind(this))
  }

  /*
    Internal method to create an collection entry

    @param {Object} collectionData JSON object
    @returns {Promise}
  */
  _createCollection(collectionData) {

    let record = {
      collection_id: collectionData.collection_id,
      name: collectionData.name,
      created: new Date(),
      edited: new Date(),
      author: collectionData.author,
      description: collectionData.description
    }

    return new Promise(function(resolve, reject) {
      this.db.collections.insert(record, function(err, collection) {
        if (err) {
          reject(new Err('CollectionStore.CreateError', {
            cause: err
          }))
        }

        resolve(collection)
      })
    }.bind(this))
  }

  /*
    Check if collection exists

    @param {String} collectionId collection id
    @returns {Promise}
  */
  collectionExists(collectionId) {
    return new Promise(function(resolve, reject) {
      this.db.collections.findOne({collection_id: collectionId}, function(err, collection) {
        if (err) {
          reject(new Err('CollectionStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(collection))
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
      this.db.seed.collectionSeed(function(err) {
        if (err) {
          return reject(new Err('CollectionStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = CollectionStore
