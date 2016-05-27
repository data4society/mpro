"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Thematic Store API.
*/
function ThematicStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

ThematicStore.Prototype = function() {

  /*
    Create a new thematic entry

    @param {Object} thematicData JSON object
    @returns {Promise}
  */
  this.createThematic = function(thematicData) {
    // Generate a thematic_id if not provided
    if (!thematicData.thematic_id) {
      thematicData.thematic_id = uuid();
    }

    if (isUndefined(thematicData.title)) {
      thematicData.title = '';
    }

    return this.thematicExists(thematicData.thematic_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('ThematicStore.CreateError', {
            message: 'Thematic ' + thematicData.thematic_id + ' already exists.'
          });
        }

        return this._createThematic(thematicData);
      });
  };

  /*
    Get thematic record for a given thematicId

    @param {String} thematicId thematic id
    @returns {Promise}
  */
  this.getThematic = function(thematicId) {
    return new Promise(function(resolve, reject) {
      this.db.thematics.findOne({thematic_id: thematicId}, function(err, thematic) {
        if (err) {
          reject(new Err('ThematicStore.ReadError', {
            cause: err
          }));
        }

        if (!thematic) {
          reject(new Err('ThematicStore.ReadError', {
            message: 'No thematic found for thematic_id ' + thematicId
          }));
        }

        resolve(thematic);
      });
    }.bind(this));
  };

  /*
    Update a thematic record with given props

    @param {String} thematicId thematic id
    @param {Object} props properties to update
    @returns {Promise}
  */
  this.updateThematic = function(thematicId, props) {
    return this.thematicExists(thematicId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('ThematicStore.UpdateError', {
            message: 'Thematic with thematic_id ' + thematicId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          var thematicData = props;
          thematicData.thematic_id = thematicId;

          this.db.thematics.save(thematicData, function(err, thematic) {
            if (err) {
              reject(new Err('ThematicStore.UpdateError', {
                cause: err
              }));
            }

            resolve(thematic);
          });
        }.bind(this));
      });
  };

  /*
    Remove a thematic from the db

    @param {String} thematicId thematic id
    @returns {Promise}
  */
  // TODO: looks like we can't remove record if
  // other record reference it through parent_id
  this.deleteThematic = function(thematicId) {
    return this.thematicExists(thematicId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('ThematicStore.DeleteError', {
            message: 'Thematic with thematic_id ' + thematicId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.thematics.destroy({thematic_id: thematicId}, function(err, thematic) {
            if (err) {
              reject(new Err('ThematicStore.DeleteError', {
                cause: err
              }));
            }
            thematic = thematic[0];
            resolve(thematic);
          });
        }.bind(this));
      });
  };

  /*
    Internal method to create a thematic entry

    @param {Object} thematicData JSON object
    @returns {Promise}
  */
  this._createThematic = function(thematicData) {

    var record = {
      thematic_id: thematicData.thematic_id,
      title: thematicData.title,
      created: new Date(),
      parent_id: thematicData.parent_id
    };

    return new Promise(function(resolve, reject) {
      this.db.thematics.insert(record, function(err, thematic) {
        if (err) {
          reject(new Err('ThematicStore.CreateError', {
            cause: err
          }));
        }

        resolve(thematic);
      });
    }.bind(this));
  };

  /*
    Check if thematic exists

    @param {String} thematicId thematic id
    @returns {Promise}
  */
  this.thematicExists = function(thematicId) {
    return new Promise(function(resolve, reject) {
      this.db.thematics.findOne({thematic_id: thematicId}, function(err, thematic) {
        if (err) {
          reject(new Err('ThematicStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(thematic));
      });
    }.bind(this));
  };

  /*
    List available thematics with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listThematics = function(filters, options) {
    var output = {};

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100;

    return new Promise(function(resolve, reject) {

      this.db.thematics.count(filters, function(err, count) {
        if (err) {
          reject(new Err('ThematicStore.ListError', {
            cause: err
          }));
        }
        output.total = count;
        
        this.db.thematics.find(filters, options, function(err, thematics) {
          if (err) {
            reject(new Err('ThematicStore.ListError', {
              cause: err
            }));
          }

          output.records = thematics;
          resolve(output);
        });
      }.bind(this));
    }.bind(this));
  };

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  this.seed = function() {
    return new Promise(function(resolve, reject) {
      this.db.seed.thematicSeed(function(err) {
        if (err) {
          return reject(new Err('ThematicStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(ThematicStore);

module.exports = ThematicStore;