"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var has = require('lodash/has');
var Promise = require("bluebird");

/*
  Implements the Change Store API.
*/
function ChangeStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

ChangeStore.Prototype = function() {

  /*
    Add a change to a document

    @param {Object} args arguments
    @param {String} args.documentId document id
    @param {Object} args.change JSON object
    @returns {Promise}
  */
  this.addChange = function(args) {
    return new Promise(function(resolve, reject) {
      var version;

      if(!has(args, 'documentId')) {
        return reject(new Err('ChangeStore.CreateError', {
          message: 'documentId is mandatory'
        }));
      }

      var owner = null;
      if(args.change.info) {
        owner = args.change.info.owner;
      }

      return this.getVersion(args.documentId).bind(this)
        .then(function(headVersion) {
          version = headVersion + 1;
          var record = {
            document_id: args.documentId,
            version: version,
            data: args.change,
            created: args.created || new Date(),
            owner: owner
          };
          
          this.db.changes.insert(record, function(err, change) {
            if (err) {
              reject(new Err('ChangeStore.CreateError', {
                cause: err
              }));
            }

            resolve(change.version);
          });
          
        });
    }.bind(this));
  };

  /*
    Get the version number for a document

    @param {String} documentId document id
    @returns {Promise}
  */
  this.getVersion = function(documentId) {
    return new Promise(function(resolve, reject) {
      this.db.changes.count({document_id: documentId}, function(err, count) {
        if (err) {
          reject(new Err('ChangeStore.GetVersionError', {
            cause: err
          }));
        }

        resolve(parseInt(count));
      });
    }.bind(this));
  };

  /*
    Get changes from the DB

    @param {Object} args arguments
    @param {String} args.documentId document id
    @param {String} args.sinceVersion changes since version (0 = all changes, 1 all except first change)
    @returns {Promise}
  */
  this.getChanges = function(args) {
    return new Promise(function(resolve, reject) {
      if(args.sinceVersion < 0) {
        return reject(new Err('ChangeStore.ReadError', {
          message: 'sinceVersion should be grater or equal then 0'
        }));
      }

      if(args.toVersion < 0) {
        return reject(new Err('ChangeStore.ReadError', {
          message: 'toVersion should be grater then 0'
        }));
      }

      if(args.sinceVersion >= args.toVersion) {
        return reject(new Err('ChangeStore.ReadError', {
          message: 'toVersion should be greater then sinceVersion'
        }));
      }

      if(!has(args, 'sinceVersion')) args.sinceVersion = 0;

      var query = {
        'document_id': args.documentId,
        'version >': args.sinceVersion
      };

      if(args.toVersion) query['version <='] = args.toVersion;

      var options = {
        order: 'version asc',
        columns: ["data"]
      };

      this.db.changes.find(query, options, function(err, changes) {
        if (err) {
          reject(new Err('ChangeStore.ReadError', {
            cause: err
          }));
        }

        this.getVersion(args.documentId)
          .then(function(headVersion) {
            var res = {
              version: headVersion,
              changes: changes
            };

            resolve(res);
          });
      }.bind(this));
    }.bind(this));
  };

  /*
    Remove all changes of a document

    @param {String} id document id
    @returns {Promise}
  */
  this.deleteChanges = function(documentId) {
    return new Promise(function(resolve, reject) {
      this.db.changes.destroy({document_id: documentId}, function(err, changes) {
        if (err) {
          reject(new Err('ChangeStore.DeleteError', {
            cause: err
          }));
        }
        resolve(changes.length);
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
      this.db.seed.changeSeed(function(err) {
        if (err) {
          return reject(new Err('ChangeStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(ChangeStore);

module.exports = ChangeStore;