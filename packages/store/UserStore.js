let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the User Store API.
*/
class UserStore {
  constructor(config) {
    this.config = config
    this.db = config.db.connection
  }

  /*
    Create a new user entry (aka signup)

    @param {Object} userData JSON object
    @returns {Promise}
  */
  createUser(userData) {
    // Generate a user_id if not provided
    if (!userData.user_id) {
      userData.user_id = uuid()
    }

    if (isUndefined(userData.name)) {
      userData.name = ''
    }

    return this.userExists(userData.user_id).bind(this)
      .then(function(exists) {
        if (exists) {
          throw new Err('UserStore.CreateError', {
            message: 'User ' + userData.user_id + ' already exists.'
          })
        }

        return this._createUser(userData)
      }.bind(this))
  }

  /*
    Get user record for a given userId

    @param {String} userId user id
    @returns {Promise}
  */
  getUser(userId) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({user_id: userId}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }))
        }

        if (!user) {
          reject(new Err('UserStore.ReadError', {
            message: 'No user found for user_id ' + userId
          }))
        }

        resolve(user)
      })
    }.bind(this))
  }

  /*
    Get user record for a given loginKey

    @param {String} loginKey login key
    @returns {Promise}
  */
  getUserByLoginKey(loginKey) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({login_key: loginKey}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }))
        }

        if (!user) {
          reject(new Err('UserStore.ReadError', {
            message: 'No user found for provided loginKey'
          }))
        }

        // map user_id to userId
        user.userId = user.user_id

        resolve(user)
      })
    }.bind(this))
  }

  /*
    Get user record for a given email

    @param {String} email user email
    @returns {Promise}
  */
  getUserByEmail(email) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({email: email}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }))
        }

        if (!user) {
          reject(new Err('UserStore.ReadError', {
            message: 'No user found with email ' + email
          }))
        }

        resolve(user)
      })
    }.bind(this))
  }

  /*
    Update a user record with given props

    @param {String} userId user id
    @param {Object} props properties to update
    @returns {Promise}
  */
  updateUser(userId, props) {
    return this.userExists(userId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('UserStore.UpdateError', {
            message: 'User with user_id ' + userId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          let userData = props
          userData.user_id = userId

          this.db.users.save(userData, function(err, user) {
            if (err) {
              reject(new Err('UserStore.UpdateError', {
                cause: err
              }))
            }

            resolve(user)
          })
        }.bind(this))
      }.bind(this))
  }

  /*
    Remove a user from the db

    @param {String} userId user id
    @returns {Promise}
  */
  deleteUser(userId) {
    return this.userExists(userId).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('UserStore.DeleteError', {
            message: 'User with user_id ' + userId + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          this.db.users.destroy({user_id: userId}, function(err, user) {
            if (err) {
              reject(new Err('UserStore.DeleteError', {
                cause: err
              }))
            }
            user = user[0]
            resolve(user)
          })
        }.bind(this))
      }.bind(this))
  }

  /*
    Internal method to create a user entry

    @param {Object} userData JSON object
    @returns {Promise}
  */
  _createUser(userData) {
    // TODO: at some point we should make this more secure
    // e.g. generate a hash-like-thing in separate method and store it
    let password = uuid()
    let loginKey = userData.loginKey || uuid()

    let record = {
      user_id: userData.user_id,
      name: userData.name,
      email: userData.email,
      created: new Date(),
      login_key: loginKey,
      password: password
    }

    return new Promise(function(resolve, reject) {
      this.db.users.insert(record, function(err, user) {
        if (err) {
          reject(new Err('UserStore.CreateError', {
            cause: err
          }))
        }

        resolve(user)
      })
    }.bind(this))
  }

  /*
    Check if user exists

    @param {String} userId user id
    @returns {Promise}
  */
  userExists(userId) {
    return new Promise(function(resolve, reject) {
      this.db.users.findOne({user_id: userId}, function(err, user) {
        if (err) {
          reject(new Err('UserStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(user))
      })
    }.bind(this))
  }

  /*
    Loads seed objects from sql query
    Be careful with running this in production

    @returns {Promise}
  */
  seed() {
    return new Promise(function(resolve, reject) {
      this.db.seed.userSeed(function(err) {
        if (err) {
          reject(new Err('UserStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = UserStore
