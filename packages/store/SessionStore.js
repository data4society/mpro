let Err = require('substance').SubstanceError
let uuid = require('substance').uuid
let isUndefined = require('lodash/isUndefined')
let Promise = require("bluebird")

/*
  Implements the Session Store API.
*/
class SessionStore {
  constructor(config) {
    this.config = config
    this.db = config.db
  }

  /*
    Create a new session (from the old one or new)

    @param {Object} session session object
    @returns {Promise}
  */
  createSession(session) {
    // map userId to session owner
    if(session.userId) session.owner = session.userId

    let newSession = {
      session_token: uuid(),
      created: new Date(),
      owner: session.owner
    }

    return new Promise(function(resolve, reject) {
      this.db.sessions.insert(newSession, function(err, session) {
        if (err) {
          reject(new Err('SessionStore.CreateError', {
            cause: err
          }))
        }
        // map session owner to userId,
        // session_token to sessionToken
        session.userId = session.owner
        session.sessionToken = session.session_token

        resolve(session)
      })
    }.bind(this))
  }

  /*
    Get session entry based on a session token

    @param {String} sessionToken session token
    @returns {Promise}
  */
  getSession(sessionToken) {
    return new Promise(function(resolve, reject) {
      this.db.sessions.findOne({session_token: sessionToken}, function(err, session) {
        if (err) {
          return reject(new Err('SessionStore.ReadError', {
            cause: err
          }))
        }

        if (!session) {
          return reject(new Err('SessionStore.ReadError', {
            message: 'No session found for session_token ' + sessionToken
          }))
        }

        // map session owner to userId,
        // session_token to sessionToken
        session.userId = session.owner
        session.sessionToken = session.session_token

        resolve(session)
      })
    }.bind(this))
  }

  /*
    Remove session entry with a given session token

    @param {String} sessionToken session token
    @returns {Promise}
  */
  deleteSession(sessionToken) {
    return this.sessionExists(sessionToken).bind(this)
      .then(function(exists) {
        if (!exists) {
          throw new Err('SessionStore.DeleteError', {
            message: 'Session with session_token ' + sessionToken + ' does not exists'
          })
        }

        return new Promise(function(resolve, reject) {
          this.db.sessions.destroy({session_token: sessionToken}, function(err, session) {
            if (err) {
              reject(new Err('SessionStore.DeleteError', {
                cause: err
              }))
            }
            session = session[0]
            resolve(session)
          })
        }.bind(this))
      }.bind(this))
  }

  /*
    Check if session exists

    @param {String} sessionToken session token
    @returns {Promise}
  */
  sessionExists(sessionToken) {
    return new Promise(function(resolve, reject) {
      this.db.sessions.findOne({session_token: sessionToken}, function(err, session) {
        if (err) {
          reject(new Err('SessionStore.ReadError', {
            cause: err
          }))
        }
        resolve(!isUndefined(session))
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
      this.db.seed.sessionSeed(function(err) {
        if (err) {
          reject(new Err('SessionStore.SeedError', {
            cause: err
          }))
        }
        resolve()
      })
    }.bind(this))
  }
}

module.exports = SessionStore
