let Err = require('substance').SubstanceError
let isEmpty = require('lodash/isEmpty')

/*
  UserServer module. Can be bound to an express instance
*/
class UserServer {
  constructor(config) {
    this.authEngine = config.authEngine
    this.engine = config.engine
    this.path = config.path
  }

  /*
    Attach this server to an express instance
  */
  bind(app) {
    // users api
    app.post(this.path, this.authEngine.hasSuperAccess.bind(this.authEngine), this._createUser.bind(this))
    app.get(this.path, this.authEngine.hasSuperAccess.bind(this.authEngine), this._listUsers.bind(this))
    app.get(this.path + '/reset/:id', this.authEngine.hasSuperAccess.bind(this.authEngine), this._resetUserPassword.bind(this))
    app.put(this.path + '/:id', this.authEngine.hasSuperAccess.bind(this.authEngine), this._updateUser.bind(this))
  }

  _createUser(req, res, next) {
    let userData = req.body

    return this.authEngine.requestNewUser(userData)
      .then(function(user) {
        res.json(user)
      }).catch(function(err) {
        return next(err)
      })
  }

  _updateUser(req, res, next) {
    let userId = req.params.id
    let data = req.body
    return this.engine.updateUser(userId, data)
      .then(function(user) {
        res.json(user)
      }).catch(function(err) {
        return next(err)
      })
  }

  _listUsers(req, res, next) {
    let filters = req.query.filters || {};
    let options = req.query.options || {};

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)

    this.engine.listUsers(filters, options, function(err, results) {
      if (err) {
        return next(new Err('UserServer.ListUsersError', {
          cause: err
        }))
      }

      res.json(results)
    })
  }

  _resetUserPassword(req, res, next) {
    let userId = req.params.id;

    return this.authEngine.requestNewPassword(userId)
      .then(function(user) {
        res.json(user)
      }).catch(function(err) {
        return next(err)
      })
  }
}

module.exports = UserServer
