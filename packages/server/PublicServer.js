let Err = require('substance').SubstanceError
let isEmpty = require('lodash/isEmpty')

/*
  UserServer module. Can be bound to an express instance
*/
class PublicServer {
  constructor(config) {
    this.engine = config.engine
    this.path = config.path
  }

  /*
    Attach this server to an express instance
  */
  bind(app) {
    app.get(this.path + '/:key', this._apiRequest.bind(this))
  }

  _apiRequest(req, res, next) {
    let key = req.params.key
    let query = req.query.query
    let options = req.query.options || {}

    if(!isEmpty(options)) options = JSON.parse(options)

    this.engine.handleApiRequest(key, query, options).then(function(resp) {
      res.json(resp)
      // if(resp.format === 'iframe') {

      // } else {
      //   res.json(resp.data)
      // }
    }).catch(function(err) {
      return next(err)
    })

  }
}

module.exports = PublicServer
