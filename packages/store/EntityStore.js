let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let extend = require('lodash/extend')
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Entity Store API.
*/
class EntityStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }
 
  /*
    Create a new entity

    @param {Object} entityData JSON object
    @returns {Promise}
  */
  createEntity(entityData) {
    // Generate an entity_id if not provided
    if (!entityData.entity_id) {
      entityData.entity_id = uuid()
    }

    if (isUndefined(entityData.name)) {
      entityData.name = ''
    }

    if (isUndefined(entityData.data)) {
      entityData.data = {}
    }

    return this.entityExists(entityData.entity_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('EntityStore.CreateError', {
            message: 'Entity ' + entityData.entity_id + ' already exists.'
          })
        }

        return this._createEntity(entityData)
      }.bind(this))
  }

  /*
    Get entity record for a given entityId

    @param {String} entityId entity id
    @returns {Promise}
  */
  getEntity(entityId) {
    return new Promise(function(resolve, reject) {
      this.db.entities.findOne({entity_id: entityId}, function(err, entity) {
        if (err) {
          reject(new Err('EntityStore.ReadError', {
            cause: err
          }))
        }

        if (!entity) {
          reject(new Err('EntityStore.ReadError', {
            message: 'No entity found for entity_id ' + entityId
          }))
        }

        resolve(entity)
      })
    }.bind(this))
  }

  /*
    Update an entity record with given props

    @param {String} entityId entity id
    @param {Object} props properties to update
    @returns {Promise}
  */
  updateEntity(entityId, props) {
    props.edited = new Date()

    return this.entityExists(entityId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('EntityStore.UpdateError', {
            message: 'Entity with entity_id ' + entityId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          let entityData = props
          entityData.entity_id = entityId

          this.db.entities.save(entityData, function(err, entity) {
            if (err) {
              reject(new Err('EntityStore.UpdateError', {
                cause: err
              }))
            }

            resolve(entity)
          })
        }.bind(this))
      }.bind(this));
  }

  /*
    Remove an entity from the db

    @param {String} entityId entity id
    @returns {Promise}
  */
  deleteEntity(entityId) {
    return this.entityExists(entityId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('EntityStore.DeleteError', {
            message: 'Entity with entity_id ' + entityId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          this.db.entities.destroy({entity_id: entityId}, function(err, entity) {
            if (err) {
              reject(new Err('EntityStore.DeleteError', {
                cause: err
              }))
            }
            entity = entity[0]
            resolve(entity)
          })
        }.bind(this))
      }.bind(this))
  }

  /*
    Quick find an entity from the db using string matching

    @param {String} pattern pattern to match
    @param {String} restrictions query restrictions
    @returns {Promise}
  */
  findEntity(pattern, restrictions) {
    return new Promise(function(resolve, reject) {
      let query = extend({'name ilike': '%' + pattern + '%'}, restrictions)
      this.db.entities.find(
        query,
        {columns: ['entity_id', 'name'], limit: 10},
        function(err, entities) {
          if (err) {
            reject(new Err('EntityStore.FindError', {
              cause: err
            }))
          }
          resolve(entities)
        }
      )
    }.bind(this))
  }

  /*
    Internal method to create an entity entry

    @param {Object} entityData JSON object
    @returns {Promise}
  */
  _createEntity(entityData) {

    let record = {
      entity_id: entityData.entity_id,
      name: entityData.name,
      created: new Date(),
      edited: new Date(),
      author: entityData.author,
      entity_class: entityData.entity_class,
      data: entityData.data
    }

    return new Promise(function(resolve, reject) {
      this.db.entities.insert(record, function(err, entity) {
        if (err) {
          reject(new Err('EntityStore.CreateError', {
            cause: err
          }))
        }

        resolve(entity)
      })
    }.bind(this))
  }

  /*
    Check if entity exists

    @param {String} entityId entity id
    @returns {Promise}
  */
  entityExists(entityId) {
    return new Promise(function(resolve, reject) {
      this.db.entities.findOne({entity_id: entityId}, function(err, entity) {
        if (err) {
          reject(new Err('EntityStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(entity))
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
      this.db.seed.entitySeed(function(err) {
        if (err) {
          return reject(new Err('EntityStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = EntityStore
