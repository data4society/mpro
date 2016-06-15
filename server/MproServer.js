'use strict';

var oo = require('substance/util/oo');
var isEmpty = require('lodash/isEmpty');

/*
  MPro Server module. Bound to an express instance.
*/
function MproServer(config) {
  this.engine = config.mproEngine;
  this.importEngine = config.importEngine;
  this.path = config.path;
}

MproServer.Prototype = function() {

  /*
    Attach this server to an express instance
  */
  this.bind = function(app) {
    app.get(this.path + '/rubrics', this._listRubrics.bind(this));
    app.get(this.path + '/classes', this._listClasses.bind(this));
    app.get(this.path + '/import', this._import.bind(this));
  };

  /*
    List rubrics with given filters and options
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

  /*
    List entity classes with given filters and options
  */
  this._listClasses = function(req, res, next) {
    var filters = req.query.filters || {};
    var options = req.query.options || {};

    if(!isEmpty(filters)) filters = JSON.parse(filters);
    if(!isEmpty(options)) options = JSON.parse(options);
    
    this.engine.listClasses(filters, options).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      return next(err);
    });
  };

  this._import = function(req, res, next) {
    var file = req.query.file || '';
    var classes = req.query.classes.split(',') || [];
    var importer = req.query.importer;

    if(importer == 'opencorpora') {
      this.importEngine.openCorporaImporter(file, classes).then(function(result) {
        if(!result) result = {status: 'ok'};
        res.json(result);
      }).catch(function(err) {
        return next(err);
      });
    } else {
      return next(new Error('wrong importer: ' + importer));
    }
  };
};

oo.initClass(MproServer);
module.exports = MproServer;