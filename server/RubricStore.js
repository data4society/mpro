"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Rubric Store API.
*/
function RubricStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

RubricStore.Prototype = function() {

  /*
    Create a new rubric entry

    @param {Object} rubricData JSON object
    @returns {Promise}
  */
  this.createRubric = function(rubricData) {
    // Generate a rubric_id if not provided
    if (!rubricData.rubric_id) {
      rubricData.rubric_id = uuid();
    }

    if (isUndefined(rubricData.title)) {
      rubricData.title = '';
    }

    return this.rubricExists(rubricData.rubric_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('RubricStore.CreateError', {
            message: 'Rubric ' + rubricData.rubric_id + ' already exists.'
          });
        }

        return this._createRubric(rubricData);
      });
  };

  /*
    Get rubric record for a given rubricId

    @param {String} rubricId rubric id
    @returns {Promise}
  */
  this.getRubric = function(rubricId) {
    return new Promise(function(resolve, reject) {
      this.db.rubrics.findOne({rubric_id: rubricId}, function(err, rubric) {
        if (err) {
          reject(new Err('RubricStore.ReadError', {
            cause: err
          }));
        }

        if (!rubric) {
          reject(new Err('RubricStore.ReadError', {
            message: 'No rubric found for rubric_id ' + rubricId
          }));
        }

        resolve(rubric);
      });
    }.bind(this));
  };

  /*
    Update a rubric record with given props

    @param {String} rubricId rubric id
    @param {Object} props properties to update
    @returns {Promise}
  */
  this.updateRubric = function(rubricId, props) {
    return this.rubricExists(rubricId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('RubricStore.UpdateError', {
            message: 'Rubric with rubric_id ' + rubricId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          var rubricData = props;
          rubricData.rubric_id = rubricId;

          this.db.rubrics.save(rubricData, function(err, rubric) {
            if (err) {
              reject(new Err('RubricStore.UpdateError', {
                cause: err
              }));
            }

            resolve(rubric);
          });
        }.bind(this));
      });
  };

  /*
    Remove a rubric from the db

    @param {String} rubricId rubric id
    @returns {Promise}
  */
  // TODO: looks like we can't remove record if
  // other record reference it through parent_id
  this.deleteRubric = function(rubricId) {
    return this.rubricExists(rubricId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('RubricStore.DeleteError', {
            message: 'Rubric with rubric_id ' + rubricId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.rubrics.destroy({rubric_id: rubricId}, function(err, rubric) {
            if (err) {
              reject(new Err('RubricStore.DeleteError', {
                cause: err
              }));
            }
            rubric = rubric[0];
            resolve(rubric);
          });
        }.bind(this));
      });
  };

  /*
    Internal method to create a rubric entry

    @param {Object} rubricData JSON object
    @returns {Promise}
  */
  this._createRubric = function(rubricData) {

    var record = {
      rubric_id: rubricData.rubric_id,
      title: rubricData.title,
      created: new Date(),
      parent_id: rubricData.parent_id
    };

    return new Promise(function(resolve, reject) {
      this.db.rubrics.insert(record, function(err, rubric) {
        if (err) {
          reject(new Err('RubricStore.CreateError', {
            cause: err
          }));
        }

        resolve(rubric);
      });
    }.bind(this));
  };

  /*
    Check if rubric exists

    @param {String} rubricId rubric id
    @returns {Promise}
  */
  this.rubricExists = function(rubricId) {
    return new Promise(function(resolve, reject) {
      this.db.rubrics.findOne({rubric_id: rubricId}, function(err, rubric) {
        if (err) {
          reject(new Err('RubricStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(rubric));
      });
    }.bind(this));
  };

  /*
    List available rubrics with given filters and options

    @param {Object} filters filters
    @param {Object} options options
    @returns {Promise}
  */
  this.listRubrics = function(filters, options) {
    var output = {};

    // Default limit for number of returned records
    if(!options.limit) options.limit = 100;

    return new Promise(function(resolve, reject) {

      this.db.rubrics.count(filters, function(err, count) {
        if (err) {
          reject(new Err('RubricStore.ListError', {
            cause: err
          }));
        }
        output.total = count;
        
        this.db.rubrics.find(filters, options, function(err, rubrics) {
          if (err) {
            reject(new Err('RubricStore.ListError', {
              cause: err
            }));
          }

          output.records = rubrics;
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
      this.db.seed.rubricSeed(function(err) {
        if (err) {
          return reject(new Err('RubricStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(RubricStore);

module.exports = RubricStore;