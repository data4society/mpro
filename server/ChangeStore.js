"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var map = require('lodash/map');
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
    @param {Callback} cb callback
    @returns {Callback}
  */
  this.addChange = function(args, cb) {
    if(!has(args, 'documentId')) {
      return cb(new Err('ChangeStore.CreateError', {
        message: 'documentId is mandatory'
      }));
    }

    var owner = null;
    if(args.change.info) {
      owner = args.change.info.owner;
    }

    this.getVersion(args.documentId, function(err, headVersion) {
      if (err) {
        return cb(new Err('ChangeStore.CreateError', {
          cause: err
        }));
      }

      var version = headVersion + 1;
      var record = {
        document_id: args.documentId,
        version: version,
        data: args.change,
        created: args.created || new Date(),
        owner: owner
      };
        
      this.db.changes.insert(record, function(err, change) {
        if (err) {
          return cb(new Err('ChangeStore.CreateError', {
            cause: err
          }));
        }

        cb(null, change.version);
      });
        
    }.bind(this));
  };

  /*
    Get the version number for a document

    @param {String} documentId document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  this.getVersion = function(documentId, cb) {
    this.db.changes.count({document_id: documentId}, function(err, count) {
      if (err) {
        return cb(new Err('ChangeStore.GetVersionError', {
          cause: err
        }));
      }

      cb(null, parseInt(count));
    });
  };

  /*
    Get changes from the DB

    @param {Object} args arguments
    @param {String} args.documentId document id
    @param {String} args.sinceVersion changes since version (0 = all changes, 1 all except first change)
    @param {Callback} cb callback
    @returns {Callback}
  */
  this.getChanges = function(args, cb) {
    if(args.sinceVersion < 0) {
      return cb(new Err('ChangeStore.ReadError', {
        message: 'sinceVersion should be grater or equal then 0'
      }));
    }

    if(args.toVersion < 0) {
      return cb(new Err('ChangeStore.ReadError', {
        message: 'toVersion should be grater then 0'
      }));
    }

    if(args.sinceVersion >= args.toVersion) {
      return cb(new Err('ChangeStore.ReadError', {
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
        return cb(new Err('ChangeStore.ReadError', {
          cause: err
        }));
      }

      // transform results to an array of changes 
      changes = map(changes, function(c) {return c.data; });

      this.getVersion(args.documentId, function(err, headVersion) {
        if (err) {
          return cb(new Err('ChangeStore.ReadError', {
            cause: err
          }));
        }

        var res = {
          version: headVersion,
          changes: changes
        };

        cb(null, res);
      });
    }.bind(this));
  };

  /*
    Remove all changes of a document

    @param {String} id document id
    @param {Callback} cb callback
    @returns {Callback}
  */
  this.deleteChanges = function(documentId, cb) {
    this.db.changes.destroy({document_id: documentId}, function(err, changes) {
      if (err) {
        return cb(new Err('ChangeStore.DeleteError', {
          cause: err
        }));
      }
      cb(null, changes.length);
    });
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