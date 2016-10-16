let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Markup Store API.
*/
class MarkupStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }

  /*
    Create a new markup entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  createMarkup(data) {
    // Generate a doc_id if not provided
    if (!data.markup_id) {
      data.markup_id = uuid()
    }

    return this.markupExists(data.markup_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('MarkupStore.CreateError', {
            message: 'Markup ' + data.markup_id + ' already exists.'
          })
        }

        return this._createMarkup(data)
      }.bind(this))
  }

  /*
    Internal method to create a markup entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  _createMarkup(markupData) {

    let record = {
      markup_id: markupData.markup_id,
      document: markupData.document,
      name: markupData.name,
      data: markupData.data,
      entity_classes: markupData.entity_classes,
      type: markupData.type
    }

    return new Promise(function(resolve, reject) {
      this.db.markups.insert(record, function(err, markup) {
        if (err) {
          reject(new Err('MarkupStore.CreateError', {
            cause: err
          }))
        }

        resolve(markup)
      })
    }.bind(this))
  }

  /*
    Check if markup exists

    @param {String} markupId markup id
    @returns {Promise}
  */
  markupExists(markupId) {
    return new Promise(function(resolve, reject) {
      this.db.markups.findOne({markup_id: markupId}, function(err, markup) {
        if (err) {
          reject(new Err('MarkupStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(markup))
      })
    }.bind(this))
  }
}

module.exports = MarkupStore
