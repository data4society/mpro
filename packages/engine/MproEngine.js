let Err = require('substance').SubstanceError
let Promise = require('bluebird')
let each = require('lodash/each')
let map = require('lodash/map')

/*
  Implements the MPro Engine API.
*/
class MproEngine {
  constructor(config) {
    this.db = config.db
    this.config = config
    this.apiStore = config.apiStore
    this.collectionStore = config.collectionStore
    this.entityStore = config.entityStore
    this.rubricStore = config.rubricStore
    this.ruleStore = config.ruleStore
    this.classStore = config.classStore
    this.userStore = config.userStore
  }

  /*
    Global app config
  */
  getConfig() {
    return new Promise(function(resolve, reject) {
      this.db.run('SELECT json FROM variables WHERE name = $1', ['last_config'], function(err, res) {
        if(err) {
          return reject(new Err('Engine.ReadConfigError', {
            cause: err
          }))
        }

        let configData = res[0]['json']['value']
        let config = {}

        each(configData, function(app, id) {
          let rubrication = app.rubrication || app.manual_rubrication ? true : false
          let entities = app.markup || app.manual_entities ? true : false

          config[id] = {
            appId: app.app_id,
            name: app.app_name,
            description: app.app_desc,
            rubrics: rubrication,
            entities: entities,
            default: app.default || false,
            configurator: app.configurator || false,
            counterrubrics: app.counterrubrics || false
          }
        })

        resolve(config)

      })
    }.bind(this))
  }

  getFilterValues(filters, source) {
    let results = {}
    return Promise.map(filters, filter => {
      let query = 'SELECT DISTINCT ' + filter + ' from ' + source;
      return new Promise((resolve, reject) => {
        this.db.run(query, function(err, values) {
          if(err) {
            return reject(new Err('Engine.GetFilterValuesError', {
              cause: err
            }))
          }
          results[filter] = map(values, function(val) {
            return val[filter]
          })
          resolve()
        })
      })
    }).then(function(){
      return results
    })

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

  /* Rubrics API */

  /*
    Create rubric

    @param {Object} rubricData new rubric data
    @returns {Promise}
  */
  createRubric(rubricData) {
    return this.rubricStore.createRubric(rubricData)
  }

  /*
    Load rubric

    @param {String} rubricId rubric id
    @returns {Promise}
  */
  getRubric(rubricId) {
    return this.rubricStore.getRubric(rubricId)
  }

  /*
    Update rubric

    @param {String} rubricId rubric id
    @param {Object} rubricData rubric data to update
    @returns {Promise}
  */
  updateRubric(rubricId, rubricData) {
    return this.rubricStore.updateRubric(rubricId, rubricData)
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
    Load collection

    @param {String} collectionId collection id
    @returns {Promise}
  */
  getCollection(collectionId) {
    return this.collectionStore.getCollection(collectionId)
  }

  /*
    Update collection

    @param {String} collectionId collection id
    @param {Object} collectionData collection data to update
    @returns {Promise}
  */
  updateCollection(collectionId, collectionData) {
    return this.collectionStore.updateCollection(collectionId, collectionData)
  }

  /*
    Remove collection

    @param {String} collectionId collection id
    @returns {Promise}
  */
  removeCollection(collectionId) {
    return this.collectionStore.deleteCollection(collectionId)
  }

  /*
    List collections

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listCollections(filters, options) {
    return this.collectionStore.listCollections(filters, options)
  }

  /*
    Find collection

    @param {String} pattern pattern to match
    @param {Object} restrictions query restrictions
    @returns {Promise}
  */
  findCollection(pattern, restrictions) {
    return this.collectionStore.findCollection(pattern, restrictions)
  }

  /* Rules API */

  /*
    Create rule

    @param {Object} ruleData new rule data
    @returns {Promise}
  */
  createRule(ruleData) {
    return this.ruleStore.createRule(ruleData)
  }

  /*
    Load rule

    @param {String} ruleId rule id
    @returns {Promise}
  */
  getRule(ruleId) {
    return this.ruleStore.getRule(ruleId)
  }

  /*
    Update rule

    @param {String} ruleId rule id
    @param {Object} ruleData rule data to update
    @returns {Promise}
  */
  updateRule(ruleId, ruleData) {
    return this.ruleStore.updateRule(ruleId, ruleData)
  }

  /*
    Remove rule

    @param {String} ruleId rule id
    @returns {Promise}
  */
  removeRule(ruleId) {
    return this.ruleStore.deleteRule(ruleId)
  }

  /*
    List rules

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listRules(filters, options) {
    return this.ruleStore.listRules(filters, options)
  }

  /*
    Check what collections matches given rubrics and entities

    @param {Array} rubrics rubrics
    @param {Array} entities entities
    @returns {Promise}
  */
  matchCollections(rubrics, entities) {
    return this.ruleStore.matchCollections(rubrics, entities)
  }

  /*
    Reaply rule
    E.g. apply rule to all existed records
    TODO: for simple rules and large record sets
    this could cause memory problems
  */
  reapplyRule(ruleId) {
    let collectionId
    let rule
    return this.ruleStore.getRule(ruleId)
      .then(function(ruleRecord) {
        rule = ruleRecord
        collectionId = rule.collection_id
        return this.collectionStore.getCollection(collectionId)
      }.bind(this))
      .then(function(collection) {
        let query = 'SELECT document_id, collections, meta, content from records WHERE '
        let vars = [rule.app_id]
        if (rule.rubrics.length > 0 && rule.entities.length > 0) {
          vars.push(rule.rubrics)
          vars.push(rule.entities)
          query += 'app_id = $1 AND rubrics::text[] @> $2 AND entities::text[] @> $3'
        } else {
          if (rule.rubrics.length > 0) {
            vars.push(rule.rubrics)
            query += 'app_id = $1 AND rubrics::text[] @> $2'
          }
          if (rule.entities.length > 0) {
            vars.push(rule.entities)
            query += 'app_id = $1 AND entities::text[] @> $2'
          }
        }

        if(collection.accepted) {
          query += ' meta->>\'aceepted\' = true'
        }

        return new Promise(function(resolve, reject) {
          this.db.run(query, vars, function(err, res){
            if(err) {
              return reject(new Err('RubricsListError', {
                cause: err
              }))
            }
            resolve(res)
          })
        }.bind(this))
      }.bind(this))
      .then(function(docs) {
        return Promise.map(docs, function(doc) {
          if(doc.collections === null) doc.collections = []
          if(doc.collections.indexOf(collectionId) > -1) {
            return false
          }
          doc.collections.push(collectionId)
          if(doc.meta.collections) {
            doc.meta.collections.push(collectionId)
          } else {
            doc.meta.collections = [collectionId]
          }

          doc.content.nodes.forEach(function(node, id) {
            if(node.type === 'meta') doc.content.nodes[id] = doc.meta
          })

          return new Promise(function(resolve, reject) {
            this.db.records.save(doc, function(err) {
              if(err) {
                return reject(new Err('RubricsListError', {
                  cause: err
                }))
              }
              resolve()
            })
          }.bind(this))
        }.bind(this), {concurrency: 10})
      }.bind(this))
      .then(function(){
        console.info('Collection', collectionId, 'has been reapplyed')
      })
  }

  /* API manager API */

  /*
    Create public api

    @param {Object} apiData new public api data
    @returns {Promise}
  */
  createApi(apiData) {
    return this.apiStore.createApi(apiData)
  }

  /*
    Load public api

    @param {String} key api key
    @returns {Promise}
  */
  getApi(key) {
    return this.apiStore.getApi(key)
  }

  /*
    Update public api

    @param {String} key api key
    @param {Object} apiData public api data to update
    @returns {Promise}
  */
  updateApi(key, apiData) {
    return this.apiStore.updateApi(key, apiData)
  }

  /*
    Remove collection

    @param {String} key api key
    @returns {Promise}
  */
  removeApi(key) {
    return this.apiStore.deleteCollection(key)
  }

  /*
    List public apis

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  listApis(filters, options) {
    return this.apiStore.listApis(filters, options)
  }

}

module.exports = MproEngine
