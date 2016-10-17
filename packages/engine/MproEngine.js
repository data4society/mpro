let Err = require('substance').SubstanceError
let Promise = require("bluebird")

/*
  Implements the MPro Engine API.
*/
class MproEngine {
  constructor(config) {
    this.config = config
    this.entityStore = config.entityStore
    this.rubricStore = config.rubricStore
    this.classStore = config.classStore
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
    Find entity

    @param {String} pattern pattern to match
    @param {Object} restrictions query restrictions
    @returns {Promise}
  */
  findEntity(pattern, restrictions) {
    return this.entityStore.findEntity(pattern, restrictions)
  }

}

module.exports = MproEngine