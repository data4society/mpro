'use strict';

var oo = require('substance/util/oo');
var isEmpty = require('lodash/isEmpty');

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
    app.get(this.path + '/thematics', this._listThematics.bind(this));
  };

  /*
    Just an example
  */
  this._listThematics = function(req, res, next) {
    var filters = req.query.filters || {};
    var options = req.query.options || {};

    if(!isEmpty(filters)) filters = JSON.parse(filters);
    if(!isEmpty(options)) options = JSON.parse(options);
    
    this.engine.listThematics(filters, options).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      return next(err);
    });
  };
};

oo.initClass(MproServer);
module.exports = MproServer;