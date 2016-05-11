"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var Promise = require("bluebird");

/*
  Implements the UserStore API.
*/
function UserStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

UserStore.Prototype = function() {

  /*
    Get user record for a given userId

    @param {String} userId user id
  */
  this.getUser = function(userId) {
    return new Promise(function(resolve) {
      this.db.users.findOne({user_id: userId}, function(err, user) {
        if (err) {
          throw new Err('UserStore.ReadError', {
            cause: err
          });
        }

        if (!user) {
          throw new Err('UserStore.ReadError', {
            message: 'No user found for userId ' + userId
          });
        }

        resolve(user);
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
      this.db.seed.userSeed(function(err) {
        if (err) {
          return reject(new Err('UserStore.SeedError', {
            cause: err
          }));
        }
        resolve();
      });
    }.bind(this));
  };
};

oo.initClass(UserStore);

module.exports = UserStore;