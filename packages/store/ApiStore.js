let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let extend = require('lodash/extend')
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Api Store API.
*/
class ApiStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }
 
  /*
    Create a new api

    @param {Object} apiData JSON object
    @returns {Promise}
  */
  createApi(apiData) {
    // Generate a key if not provided
    if (!apiData.key) {
      apiData.key = uuid()
    }

    return this.apiExists(apiData.key).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('ApiStore.CreateError', {
            message: 'Api with key ' + apiData.key + ' already exists.'
          })
        }

        return this._createApi(apiData)
      }.bind(this))
  }

  /*
    Get api record for a given key

    @param {String} key api key
    @returns {Promise}
  */
  getApi(key) {
    return new Promise(function(resolve, reject) {
      this.db.apis.findOne({key: key}, function(err, api) {
        if (err) {
          reject(new Err('ApiStore.ReadError', {
            cause: err
          }))
        }

        if (!api) {
          reject(new Err('ApiStore.ReadError', {
            message: 'No api found for key ' + key
          }))
        }

        resolve(api)
      })
    }.bind(this))
  }

  /*
    Update an api record with given props

    @param {String} key api id
    @param {Object} props properties to update
    @returns {Promise}
  */
  updateApi(key, props) {
    return this.apiExists(key).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('ApiStore.UpdateError', {
            message: 'Api with key ' + key + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          let apiData = props
          apiData.key = key

          this.db.apis.save(apiData, function(err, api) {
            if (err) {
              reject(new Err('ApiStore.UpdateError', {
                cause: err
              }))
            }

            resolve(api)
          })
        }.bind(this))
      }.bind(this));
  }

  /*
    Remove an api from the db

    @param {String} key api key
    @returns {Promise}
  */
  deleteApi(key) {
    return this.apiExists(key).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('ApiStore.DeleteError', {
            message: 'Api with key ' + key + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          this.db.apis.destroy({key: key}, function(err, api) {
            if (err) {
              reject(new Err('ApiStore.DeleteError', {
                cause: err
              }))
            }
            api = api[0]
            resolve(api)
          })
        }.bind(this))
      }.bind(this))
  }

  listApis(filters, options) {
    let output = {}

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100

    return new Promise(function(resolve, reject) {
      this.db.apis.count(filters, function(err, count) {
        if (err) {
          return reject(new Err('ApiStore.ListError', {
            cause: err
          }))
        }
        output.total = count
        
        this.db.apis.find(filters, options, function(err, apis) {
          if (err) {
            return reject(new Err('ApiStore.ListError', {
              cause: err
            }))
          }
          output.records = apis
          
          resolve(output)
        })
      }.bind(this))
    }.bind(this))
  }

  /*
    Internal method to create an api entry

    @param {Object} apiData JSON object
    @returns {Promise}
  */
  _createApi(apiData) {

    let record = {
      key: apiData.key, 
      api: apiData.api, 
      format: apiData.format, 
      param: apiData.param, 
      live: apiData.live, 
      app_id: apiData.app_id
    }

    return new Promise(function(resolve, reject) {
      this.db.apis.insert(record, function(err, api) {
        if (err) {
          reject(new Err('ApiStore.CreateError', {
            cause: err
          }))
        }

        resolve(api)
      })
    }.bind(this))
  }

  /*
    Check if api exists

    @param {String} key api key
    @returns {Promise}
  */
  apiExists(key) {
    return new Promise(function(resolve, reject) {
      this.db.apis.findOne({key: key}, function(err, api) {
        if (err) {
          reject(new Err('ApiStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(api))
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
      this.db.seed.apiSeed(function(err) {
        if (err) {
          return reject(new Err('ApiStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = ApiStore
