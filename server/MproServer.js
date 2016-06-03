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
    app.get(this.path + '/rubrics', this._listRubrics.bind(this));
  };

  /*
    Just an example
  */
  this._listRubrics = function(req, res, next) {
    var filters = req.query.filters || {};
    var options = req.query.options || {};

    if(!isEmpty(filters)) filters = JSON.parse(filters);
    if(!isEmpty(options)) options = JSON.parse(options);
    
    this.engine.listRubrics(filters, options).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      return next(err);
    });
  };
};

oo.initClass(MproServer);
module.exports = MproServer;