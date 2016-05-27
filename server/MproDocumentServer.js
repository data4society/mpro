var DocumentServer = require('substance/collab/DocumentServer');
var isEmpty = require('lodash/isEmpty');

/*
  MPro Document Server module. Bound to an express instance.
*/
function MproDocumentServer() {
  MproDocumentServer.super.apply(this, arguments);
}

MproDocumentServer.Prototype = function() {
  var _super = MproDocumentServer.super.prototype;

  /*
    Adding routes to general document server
  */
  this.bind = function(app) {
    _super.bind.apply(this, arguments);

    // MPro document specific routes
    app.get(this.path, this._listDocuments.bind(this));
  };

  /*
    App specific methods
  */
  this._listDocuments = function(req, res, next) {
    var filters = req.query.filters || {};
    var options = req.query.options || {};

    if(!isEmpty(filters)) filters = JSON.parse(filters);
    if(!isEmpty(options)) options = JSON.parse(options);

    this.engine.listDocuments(filters, options, function(err, result) {
      if (err) return next(err);
      res.json(result);
    });
  };
};

DocumentServer.extend(MproDocumentServer);

module.exports = MproDocumentServer;