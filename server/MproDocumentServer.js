var DocumentServer = require('substance/collab/DocumentServer');

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
    app.get(this.path + '/documents', this._listDocuments.bind(this));
  };

  /*
    App specific methods
  */
  this._listDocuments = function(req, res, next) {

    // TODO: get filters and options from url query
    var filters = {};
    var options = {};

    this.engine.listDocuments(filters, options, function(err, result) {
      if (err) return next(err);
      res.json(result);
    });
  };
};

DocumentServer.extend(MproDocumentServer);

module.exports = MproDocumentServer;