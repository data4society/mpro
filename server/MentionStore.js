"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Mention Store API.
*/
function MentionStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

MentionStore.Prototype = function() {

  /*
    Create a new mention entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  this.createMention = function(data) {
    // Generate a doc_id if not provided
    if (!data.mention_id) {
      data.mention_id = uuid();
    }

    return this.mentionExists(data.mention_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('MentionStore.CreateError', {
            message: 'Mention ' + data.mention_id + ' already exists.'
          });
        }

        return this._createMention(data);
      });
  };

  /*
    Internal method to create a mention entry

    @param {Object} data JSON object
    @returns {Promise}
  */
  this._createMention = function(mentionData) {

    var record = {
      mention_id: mentionData.mention_id,
      markup: mentionData.markup,
      reference_ids: mentionData.reference_ids,
      outer_id: mentionData.outer_id
    };

    return new Promise(function(resolve, reject) {
      this.db.mentions.insert(record, function(err, mention) {
        if (err) {
          reject(new Err('MentionStore.CreateError', {
            cause: err
          }));
        }

        resolve(mention);
      });
    }.bind(this));
  };

  /*
    Check if mention exists

    @param {String} mentionId mention id
    @returns {Promise}
  */
  this.mentionExists = function(mentionId) {
    return new Promise(function(resolve, reject) {
      this.db.mentions.findOne({mention_id: mentionId}, function(err, mention) {
        if (err) {
          reject(new Err('MentionStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(mention));
      });
    }.bind(this));
  };

};

oo.initClass(MentionStore);

module.exports = MentionStore;