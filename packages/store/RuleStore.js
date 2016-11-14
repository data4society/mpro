let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let isUndefined = require('lodash/isUndefined')
let map = require('lodash/map')
let Promise = require('bluebird')

/*
  Implements the Rule Store API.
*/
class RuleStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }
 
  /*
    Create a new rule

    @param {Object} ruleData JSON object
    @returns {Promise}
  */
  createRule(ruleData) {
    // Generate an rule_id if not provided
    if (!ruleData.rule_id) {
      ruleData.rule_id = uuid()
    }

    return this.ruleExists(ruleData.rule_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('RuleStore.CreateError', {
            message: 'Rule ' + ruleData.rule_id + ' already exists.'
          })
        }

        return this._createRule(ruleData)
      }.bind(this))
  }

  /*
    Get rule record for a given ruleId

    @param {String} ruleId rule id
    @returns {Promise}
  */
  getRule(ruleId) {
    return new Promise(function(resolve, reject) {
      this.db.rules.findOne({rule_id: ruleId}, function(err, rule) {
        if (err) {
          reject(new Err('RuleStore.ReadError', {
            cause: err
          }))
        }

        if (!rule) {
          reject(new Err('RuleStore.ReadError', {
            message: 'No rule found for rule_id ' + ruleId
          }))
        }

        resolve(rule)
      })
    }.bind(this))
  }

  /*
    Update an rule record with given props

    @param {String} ruleId rule id
    @param {Object} props properties to update
    @returns {Promise}
  */
  updateRule(ruleId, props) {
    return this.ruleExists(ruleId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('RuleStore.UpdateError', {
            message: 'Rule with rule_id ' + ruleId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          let ruleData = props
          ruleData.rule_id = ruleId

          this.db.rules.save(ruleData, function(err, rule) {
            if (err) {
              reject(new Err('RuleStore.UpdateError', {
                cause: err
              }))
            }

            resolve(rule)
          })
        }.bind(this))
      }.bind(this));
  }

  /*
    Remove an rule from the db

    @param {String} ruleId rule id
    @returns {Promise}
  */
  deleteRule(ruleId) {
    return this.ruleExists(ruleId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('RuleStore.DeleteError', {
            message: 'Rule with rule_id ' + ruleId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          this.db.rules.destroy({rule_id: ruleId}, function(err, rule) {
            if (err) {
              reject(new Err('RuleStore.DeleteError', {
                cause: err
              }))
            }
            rule = rule[0]
            resolve(rule)
          })
        }.bind(this))
      }.bind(this))
  }

  listRules(filters, options) {
    let output = {}

    let entitiesNamesQuery = '(SELECT array(SELECT name FROM unnest(entities) entity LEFT JOIN entities r on r.entity_id::text=entity)) AS entities_names'
    let rubricNamesQuery = '(SELECT array(SELECT name FROM unnest(rubrics) rubric LEFT JOIN rubrics r on r.rubric_id::text=rubric)) AS rubrics_names'

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100
    if(!options.columns) options.columns = ['rule_id', 'collection_id', 'rubrics', 'entities', entitiesNamesQuery, rubricNamesQuery]

    return new Promise(function(resolve, reject) {
      this.db.rules.count(filters, function(err, count) {
        if (err) {
          return reject(new Err('RuleStore.ListError', {
            cause: err
          }))
        }
        output.total = count
        
        this.db.rules.find(filters, options, function(err, rules) {
          if (err) {
            return reject(new Err('RuleStore.ListError', {
              cause: err
            }))
          }
          output.records = rules
          
          resolve(output)
        })
      }.bind(this))
    }.bind(this))
  }

  /*
    Internal method to create an rule entry

    @param {Object} ruleData JSON object
    @returns {Promise}
  */
  _createRule(ruleData) {

    let record = {
      rule_id: ruleData.rule_id,
      collection_id: ruleData.collection_id,
      rubrics: ruleData.rubrics,
      entities: ruleData.entities
    }

    return new Promise(function(resolve, reject) {
      this.db.rules.insert(record, function(err, rule) {
        if (err) {
          reject(new Err('RuleStore.CreateError', {
            cause: err
          }))
        }

        resolve(rule)
      })
    }.bind(this))
  }

  /*
    Check if rule exists

    @param {String} ruleId rule id
    @returns {Promise}
  */
  ruleExists(ruleId) {
    return new Promise(function(resolve, reject) {
      this.db.rules.findOne({rule_id: ruleId}, function(err, rule) {
        if (err) {
          reject(new Err('RuleStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(rule))
      })
    }.bind(this))
  }

  /*
    Check what collections matches given rubrics and entities

    @param {Array} rubrics rubrics
    @param {Array} entities entities
    @returns {Promise}
  */
  matchCollections(rubrics, entities) {
    let query = `SELECT DISTINCT collection_id from rules WHERE 
rubrics::text[] <@ $1 AND entities::text[] <@ $2
OR rubrics::text[] <@ $1 AND entities = '{}'
OR rubrics = '{}' AND entities::text[] <@ $2`

    return new Promise(function(resolve, reject) {
      this.db.run(query, [rubrics, entities], function(err, result) {
        if(err) {
          return reject(new Err('RuleStore.MatchCollections', {
            cause: err
          }))
        }
        result = map(result, 'collection_id')
        resolve(result)
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
      this.db.seed.ruleSeed(function(err) {
        if (err) {
          return reject(new Err('RuleStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = RuleStore
