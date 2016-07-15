"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/SubstanceError');
var uuid = require('substance/util/uuid');
var isEmpty = require('lodash/isEmpty');
var isUndefined = require('lodash/isUndefined');
var each = require('lodash/each');
var find = require('lodash/find');
var Promise = require("bluebird");

// Massive internal libs
var ArgTypes = require('../node_modules/massive/lib/arg_types');
var Where = require('../node_modules/massive/lib/where');

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

    if (isUndefined(rubricData.name)) {
      rubricData.name = '';
    }

    return this.rubricExists(rubricData.rubric_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('RubricStore.CreateError', {
            message: 'Rubric ' + rubricData.rubric_id + ' already exists.'
          });
        }

        return this._createRubric(rubricData);
      }.bind(this));
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
      }.bind(this));
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
      }.bind(this));
  };

  /*
    Internal method to create a rubric entry

    @param {Object} rubricData JSON object
    @returns {Promise}
  */
  this._createRubric = function(rubricData) {

    var record = {
      rubric_id: rubricData.rubric_id,
      name: rubricData.name,
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
    // Default limit for number of returned records
    if(!options.limit) options.limit = 100;

    return new Promise(function(resolve, reject) {

      this.listFacets(filters, options).then(function(facets) {
        this.db.rubrics.find({}, options, function(err, rubrics) {
          if (err) {
            reject(new Err('RubricStore.ListError', {
              cause: err
            }));
          }

          each(facets, function(facet) {
            var rubric = find(rubrics, { 'rubric_id': facet.rubric });
            rubric.cnt = facet.cnt;
          });

          resolve(rubrics);
        });
      }.bind(this));
    }.bind(this));
  };

  /*
    List facets with given filters

    @param {Array} rubrics rubrics
    @returns {Promise}
  */
  // eslint-disable-next-line
  this.listFacets = function(filters, options) {
    var args = ArgTypes.findArgs(arguments, this);
    var where = isEmpty(args.conditions) ? {where: " "} : Where.forTable(args.conditions);

    var sql = 'SELECT rubric, cnt, rubrics.name FROM (\
      SELECT DISTINCT\
        unnest(records.rubrics) AS rubric,\
        COUNT(*) OVER (PARTITION BY unnest(records.rubrics)) cnt\
      FROM records' + where.where + ') AS docs INNER JOIN rubrics ON (docs.rubric = rubrics.rubric_id)';

    return new Promise(function(resolve, reject) {

      this.db.run(sql, where.params, args.options, function(err, facets){
        if (err) {
          reject(new Err('RubricStore.FacetsError', {
            cause: err
          }));
        }
          
        resolve(facets);
      });
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