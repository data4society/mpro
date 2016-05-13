"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the Session Store API.
*/
function SessionStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

SessionStore.Prototype = function() {

  /*
    Create a new session (from the old one or new)

    @param {Object} session session object
    @returns {Promise}
  */
  this.createSession = function(session) {
    var newSession = {
      session_token: uuid(),
      created: new Date(),
      owner: session.owner
    };

    return new Promise(function(resolve, reject) {
      this.db.sessions.insert(newSession, function(err, session) {
        if (err) {
          reject(new Err('SessionStore.CreateError', {
            cause: err
          }));
        }

        resolve(session);
      });
    }.bind(this));
  };

  /*
    Get session entry based on a session token

    @param {String} sessionToken session token
    @returns {Promise}
  */
  this.getSession = function(sessionToken) {
    return new Promise(function(resolve, reject) {
      this.db.sessions.findOne({session_token: sessionToken}, function(err, session) {
        if (err) {
          reject(new Err('SessionStore.ReadError', {
            cause: err
          }));
        }

        if (!session) {
          reject(new Err('SessionStore.ReadError', {
            message: 'No session found for session_token ' + sessionToken
          }));
        }

        resolve(session);
      });
    }.bind(this));
  };

  /*
    Remove session entry with a given session token

    @param {String} sessionToken session token
    @returns {Promise}
  */
  this.deleteSession = function(sessionToken) {
    return this.sessionExists(sessionToken).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('SessionStore.DeleteError', {
            message: 'Session with session_token ' + sessionToken + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.sessions.destroy({session_token: sessionToken}, function(err, session) {
            if (err) {
              reject(new Err('SessionStore.DeleteError', {
                cause: err
              }));
            }
            session = session[0];
            resolve(session);
          });
        }.bind(this));
      });
  };

  /*
    Check if session exists

    @param {String} sessionToken session token
    @returns {Promise}
  */
  this.sessionExists = function(sessionToken) {
    return new Promise(function(resolve, reject) {
      this.db.sessions.findOne({session_token: sessionToken}, function(err, session) {
        if (err) {
          reject(new Err('SessionStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(session));
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
      this.db.seed.sessionSeed(function(err) {
        if (err) {
          reject(new Err('SessionStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(SessionStore);

module.exports = SessionStore;