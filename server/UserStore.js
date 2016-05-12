"use strict";

var oo = require('substance/util/oo');
var Err = require('substance/util/Error');
var uuid = require('substance/util/uuid');
var isUndefined = require('lodash/isUndefined');
var Promise = require("bluebird");

/*
  Implements the User Store API.
*/
function UserStore(config) {
  this.config = config;
  this.db = config.db.connection;
}

UserStore.Prototype = function() {

  /*
    Create a new user entry (aka signup)

    @param {Object} userData JSON object
    @returns {Promise}
  */
  this.createUser = function(userData) {
    // Generate a user_id if not provided
    if (!userData.user_id) {
      userData.user_id = uuid();
    }

    if (isUndefined(userData.name)) {
      userData.name = '';
    }

    return this.userExists(userData.user_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('UserStore.CreateError', {
            message: 'User ' + userData.user_id + ' already exists.'
          });
        }

        return this._createUser(userData);
      });
  };

  /*
    Get user record for a given userId

    @param {String} userId user id
    @returns {Promise}
  */
  this.getUser = function(userId) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({user_id: userId}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }));
        }

        if (!user) {
          reject(new Err('UserStore.ReadError', {
            message: 'No user found for user_id ' + userId
          }));
        }

        resolve(user);
      });
    }.bind(this));
  };

  /*
    Get user record for a given email

    @param {String} email user email
    @returns {Promise}
  */
  this.getUserByEmail = function(email) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({email: email}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }));
        }

        if (!user) {
          reject(new Err('UserStore.ReadError', {
            message: 'No user found with email ' + email
          }));
        }

        resolve(user);
      });
    }.bind(this));
  };

  /*
    Update a user record with given props

    @param {String} userId user id
    @param {Object} props properties to update
    @returns {Promise}
  */
  this.updateUser = function(userId, props) {
    return this.userExists(userId)
      .then(function(exists) {
        if (!exists) {
          throw new Err('UserStore.UpdateError', {
            message: 'User with user_id ' + userId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          var userData = props;
          userData.user_id = userId;

          this.db.users.save(userData, function(err, user) {
            if (err) {
              reject(new Err('UserStore.UpdateError', {
                cause: err
              }));
            }

            resolve(user);
          });
        }.bind(this));
      });
  };

  /*
    Remove a user from the db

    @param {String} userId user id
    @returns {Promise}
  */
  this.deleteUser = function(userId) {
    return this.userExists(userId)
      .then(function(exists) {
        if (!exists) {
          throw new Err('UserStore.DeleteError', {
            message: 'User with user_id ' + userId + ' does not exists'
          });
        }

        return new Promise(function(resolve, reject) {
          this.db.users.destroy({user_id: userId}, function(err, user) {
            if (err) {
              reject(new Err('UserStore.DeleteError', {
                cause: err
              }));
            }
            user = user[0];
            resolve(user);
          });
        }.bind(this));
      });
  };

  /*
    Internal method to create a user entry

    @param {Object} userData JSON object
    @returns {Promise}
  */
  this._createUser = function(userData) {
    // TODO: at some point we should make this more secure
    // e.g. generate a hash-like-thing in separate method and store it
    var password = uuid();

    var record = {
      user_id: userData.user_id,
      name: userData.name,
      email: userData.email,
      created: new Date(),
      password: password
    };

    return new Promise(function(resolve, reject) {
      this.db.users.insert(record, function(err, user) {
        if (err) {
          reject(new Err('UserStore.CreateError', {
            cause: err
          }));
        }

        resolve(user);
      });
    }.bind(this));
  };

  /*
    Check if user exists

    @param {String} userId user id
    @returns {Promise}
  */
  this.userExists = function(userId) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({user_id: userId}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }));
        }
        resolve(!isUndefined(user));
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
          reject(new Err('UserStore.SeedError', {
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