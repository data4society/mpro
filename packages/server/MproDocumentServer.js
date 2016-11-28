let DocumentServer = require('substance').DocumentServer
let isEmpty = require('lodash/isEmpty')

/*
  MPro Document Server module. Bound to an express instance.
*/
class MproDocumentServer extends DocumentServer {
  constructor(config) {
    super(config)
    this.authEngine = config.authEngine
  }

  /*
    Adding routes to general document server
  */
  bind(app) {
    app.post(this.path, this.authEngine.hasAccess.bind(this.authEngine), this._createDocument.bind(this))
    app.get(this.path + '/:id', this.authEngine.hasAccess.bind(this.authEngine),this._getDocument.bind(this))
    app.delete(this.path + '/:id', this.authEngine.hasAccess.bind(this.authEngine), this._deleteDocument.bind(this))

    // MPro document specific routes
    app.get(this.path, this.authEngine.hasAccess.bind(this.authEngine), this._listDocuments.bind(this))
  }

  /*
    App specific methods
  */
  _listDocuments(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)

    this.engine.listDocuments(filters, options, function(err, result) {
      if (err) return next(err)
      res.json(result)
    })
  }
}

module.exports = MproDocumentServer
