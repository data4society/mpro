let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Mention Store API.
*/
class MentionStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }

  /*
    Create a new mention entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  createMention(data) {
    // Generate a doc_id if not provided
    if (!data.mention_id) {
      data.mention_id = uuid()
    }

    return this.mentionExists(data.mention_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('MentionStore.CreateError', {
            message: 'Mention ' + data.mention_id + ' already exists.'
          })
        }

        return this._createMention(data)
      }.bind(this))
  }

  /*
    Internal method to create a mention entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  _createMention(mentionData) {

    let record = {
      mention_id: mentionData.mention_id,
      markup: mentionData.markup,
      entity_class: mentionData.entity_class,
      reference_ids: mentionData.reference_ids,
      outer_id: mentionData.outer_id
    }

    return new Promise(function(resolve, reject) {
      this.db.mentions.insert(record, function(err, mention) {
        if (err) {
          reject(new Err('MentionStore.CreateError', {
            cause: err
          }))
        }

        resolve(mention)
      })
    }.bind(this))
  }

  /*
    Check if mention exists

    @param {String} mentionId mention id
    @returns {Promise}
  */
  mentionExists(mentionId) {
    return new Promise(function(resolve, reject) {
      this.db.mentions.findOne({mention_id: mentionId}, function(err, mention) {
        if (err) {
          reject(new Err('MentionStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(mention))
      })
    }.bind(this))
  }
}

module.exports = MentionStore
