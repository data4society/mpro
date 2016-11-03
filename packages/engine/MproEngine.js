let Err = require('substance').SubstanceError
let Promise = require("bluebird")

/*
  Implements the MPro Engine API.
*/
class MproEngine {
  constructor(config) {
    this.config = config
    this.collectionStore = config.collectionStore
    this.entityStore = config.entityStore
    this.rubricStore = config.rubricStore
    this.classStore = config.classStore
    this.userStore = config.userStore
  }

  /*
    List rubrics with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listRubrics(filters, options) {
    return new Promise(function(resolve, reject) {
      this.rubricStore.listRubrics(filters, options).then(function(results) {
        resolve(results)
      }).catch(function(err) {
        reject(new Err('RubricsListError', {
          cause: err
        }))
      })
    }.bind(this))
  }

  /*
    List entity classes with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listClasses(filters, options) {
    return new Promise(function(resolve, reject) {
      this.classStore.listClasses(filters, options).then(function(results) {
        resolve(results)
      }).catch(function(err) {
        reject(new Err('ImportEngine.listEntityClassesError', {
          cause: err
        }))
      })
    }.bind(this))
  }

  /*
    List facets for given rubrics

    @param {Array} facets facets
    @returns {Promise}
  */
  listFacets(facets, training) {
    return new Promise(function(resolve, reject) {
      this.rubricStore.listFacets(facets, training).then(function(results) {
        resolve(results)
      }).catch(function(err) {
        reject(new Err('RubricsFacetsError', {
          cause: err
        }))
      })
    }.bind(this))
  }

  /*
    Create entity

    @param {Object} entityData new entity data
    @returns {Promise}
  */
  createEntity(entityData) {
    return this.entityStore.createEntity(entityData)
  }

  /*
    Load entity

    @param {String} entityId entity id
    @returns {Promise}
  */
  getEntity(entityId) {
    return this.entityStore.getEntity(entityId)
  }

  /*
    Update entity

    @param {String} entityId entity id
    @param {Object} entityData entity data to update
    @returns {Promise}
  */
  updateEntity(entityId, entityData) {
    return this.entityStore.updateEntity(entityId, entityData)
  }

  /*
    List entities

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listEntities(filters, options) {
    return this.entityStore.listEntities(filters, options)
  }

  /*
    Find entity

    @param {String} pattern pattern to match
    @param {Object} restrictions query restrictions
    @returns {Promise}
  */
  findEntity(pattern, restrictions) {
    return this.entityStore.findEntity(pattern, restrictions)
  }

  /* Users API */

  /** 
   * Updates User's record from json object
   *
   * @param {string} userId - The user_id of target user record
   * @param {string} data - JSON object with updated properties
   */

  updateUser(userId, data) {
    return this.userStore.updateUser(userId, data)
  }

  /** 
   * List users with given filters and options
   *
   * @param {Object} filters filters
   * @param {Object} options options
   * @param {callback} cb - The callback that handles the results 
   */

  listUsers(filters, options, cb) {
    this.userStore.listUsers(filters, options, cb)
  }

  /* Collections API */

  /*
    Create collection

    @param {Object} collectionData new collection data
    @returns {Promise}
  */
  createCollection(collectionData) {
    return this.collectionStore.createCollection(collectionData)
  }

  /*
    Load entity

    @param {String} entityId entity id
    @returns {Promise}
  */
  getCollection(collectionId) {
    return this.collectionStore.getCollection(collectionId)
  }

  /*
    Update entity

    @param {String} entityId entity id
    @param {Object} entityData entity data to update
    @returns {Promise}
  */
  updateCollection(collectionId, collectionData) {
    return this.collectionStore.updateCollection(collectionId, collectionData)
  }

  /*
    List entities

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listCollections(filters, options) {
    return this.collectionStore.listCollections(filters, options)
  }

  /*
    Find entity

    @param {String} pattern pattern to match
    @param {Object} restrictions query restrictions
    @returns {Promise}
  */
  findCollection(pattern, restrictions) {
    return this.collectionStore.findCollection(pattern, restrictions)
  }

}

module.exports = MproEngine
