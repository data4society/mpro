'use strict';

var oo = require('substance/util/oo');
var isEmpty = require('lodash/isEmpty');

/*
  MPro Server module. Bound to an express instance.
*/
function MproServer(config) {
  this.engine = config.mproEngine;
  this.importEngine = config.importEngine;
  this.sourceEngine = config.sourceEngine;
  this.path = config.path;
}

MproServer.Prototype = function() {

  /*
    Attach this server to an express instance
  */
  this.bind = function(app) {
    app.get(this.path + '/rubrics', this._listRubrics.bind(this));
    app.get(this.path + '/classes', this._listClasses.bind(this));
    app.get(this.path + '/facets', this._listFacets.bind(this));
    app.get(this.path + '/import', this._import.bind(this));
    app.put(this.path + '/sources/:id', this._updateSource.bind(this));
    // Convert all accepted documents
    //app.get(this.path + '/sources/training', this._convertTrainingDocs.bind(this));
    app.post(this.path + '/entities', this._createEntity.bind(this));
    app.get(this.path + '/entities/search', this._searchEntity.bind(this));
    app.get(this.path + '/entities/:id', this._getEntity.bind(this));
    app.put(this.path + '/entities/:id', this._updateEntity.bind(this));
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

  /*
    List facets with given rubrics
  */
  this._listFacets = function(req, res, next) {
    var facets = req.query.facets || {};
    var training = req.query.training || false;

    if(!isEmpty(facets)) facets = JSON.parse(facets);
    
    this.engine.listFacets(facets, training).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      return next(err);
    });
  };

  this._updateSource = function(req, res, next) {
    var documentId = req.params.id;
    var sourceData = req.body;
    this.sourceEngine.updateSource(documentId, sourceData).then(function() {
      res.json(null);
    }).catch(function(err) {
      return next(err);
    });
  };  

  /*
    Import external data
  */
  this._import = function(req, res, next) {
    var file = req.query.file || '';
    var classes = req.query.classes.split(',') || [];
    var importer = req.query.importer;

    if(importer === 'opencorpora') {
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

  this._convertTrainingDocs = function(req, res, next) {
    this.sourceEngine.convertTrainingDocs().then(function() {
      res.send('done');
    }).catch(function(err) {
      return next(err);
    });
  };  

  /*
    Create Entity
  */
  this._createEntity = function(req, res, next) {
    var entityData = req.body;
    this.engine.createEntity(entityData).then(function(entity) {
      res.json(entity);
    }).catch(function(err) {
      return next(err);
    });
  };

  /*
    Get Entity
  */
  this._getEntity = function(req, res, next) {
    var entityId = req.params.id;
    this.engine.getEntity(entityId).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      return next(err);
    });
  };

  /*
    Update Entity
  */
  this._updateEntity = function(req, res, next) {
    var entityId = req.params.id;
    var entityData = req.body;
    this.engine.updateEntity(entityId, entityData).then(function() {
      res.json(null);
    }).catch(function(err) {
      return next(err);
    });
  };

  /*
    Search Entity
  */
  this._searchEntity = function(req, res, next) {
    var pattern = req.query.value;
    var restrictions = JSON.parse(req.query.restrictions);
    this.engine.findEntity(pattern, restrictions).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      return next(err);
    });
  };  
};

oo.initClass(MproServer);
module.exports = MproServer;