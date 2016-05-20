'use strict';

var oo = require('substance/util/oo');

/*
  MPro Server module. Bound to an express instance.
*/
function MproServer(config) {
  this.engine = config.mproEngine;
  this.path = config.path;
}

MproServer.Prototype = function() {

  /*
    Attach this server to an express instance
  */
  this.bind = function(app) {
    app.get(this.path + '/something/:id', this._someHandler.bind(this));
  };

  /*
    Just an example
  */
  this._someHandler = function(req, res, next) {
    var id = req.params.id;
    this.engine.getSomething(id, function(err, records) {
      if (err) return next(err);
      res.json(records);
    });
  };
};

oo.initClass(MproServer);
module.exports = MproServer;