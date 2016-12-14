let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Reference Store API.
*/
class ReferenceStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }

  /*
    Create a new reference entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  createReference(data) {
    // Generate a doc_id if not provided
    if (!data.reference_id) {
      data.reference_id = uuid()
    }

    return this.referenceExists(data.reference_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('ReferenceStore.CreateError', {
            message: 'Reference ' + data.reference_id + ' already exists.'
          })
        }

        return this._createReference(data)
      }.bind(this))
  }

  /*
    Internal method to create a reference entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  _createReference(referenceData) {

    let record = {
      reference_id: referenceData.reference_id,
      markup: referenceData.markup,
      entity_class: referenceData.entity_class,
      entity: referenceData.entity,
      start_offset: referenceData.start_offset,
      end_offset: referenceData.end_offset,
      length_offset: referenceData.length_offset,
      outer_id: referenceData.outer_id
    }

    return new Promise(function(resolve, reject) {
      this.db.references.insert(record, function(err, reference) {
        if (err) {
          reject(new Err('ReferenceStore.CreateError', {
            cause: err
          }))
        }

        resolve(reference)
      })
    }.bind(this))
  }

  /*
    Check if reference exists

    @param {String} referenceId reference id
    @returns {Promise}
  */
  referenceExists(referenceId) {
    return new Promise(function(resolve, reject) {
      this.db.references.findOne({reference_id: referenceId}, function(err, reference) {
        if (err) {
          reject(new Err('ReferenceStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(reference))
      })
    }.bind(this))
  }
}

module.exports = ReferenceStore
