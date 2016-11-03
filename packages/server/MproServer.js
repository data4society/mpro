let isEmpty = require('lodash/isEmpty')

/*
  MPro Server module. Bound to an express instance.
*/
class MproServer {
  constructor(config) {
    this.engine = config.mproEngine;
    this.importEngine = config.importEngine;
    this.sourceEngine = config.sourceEngine;
    this.path = config.path;
  }

  /*
    Attach this server to an express instance
  */
  bind(app) {
    app.get(this.path + '/rubrics', this._listRubrics.bind(this))
    app.get(this.path + '/classes', this._listClasses.bind(this))
    app.get(this.path + '/facets', this._listFacets.bind(this))
    app.get(this.path + '/import', this._import.bind(this))
    app.put(this.path + '/sources/:id', this._updateSource.bind(this))
    // Convert all accepted documents
    app.get(this.path + '/sources/training', this._convertTrainingDocs.bind(this))
    // Collections CRUD
    app.post(this.path + '/collections', this._createCollection.bind(this))
    app.get(this.path + '/collections', this._listCollections.bind(this))
    app.get(this.path + '/collections/search', this._searchCollection.bind(this))
    app.get(this.path + '/collections/:id', this._getCollection.bind(this))
    app.put(this.path + '/collections/:id', this._updateCollection.bind(this))
    // Entities CRUD
    app.post(this.path + '/entities', this._createEntity.bind(this))
    app.get(this.path + '/entities', this._listEntities.bind(this))
    app.get(this.path + '/entities/search', this._searchEntity.bind(this))
    app.get(this.path + '/entities/:id', this._getEntity.bind(this))
    app.put(this.path + '/entities/:id', this._updateEntity.bind(this))
  }

  /*
    List rubrics with given filters and options
  */
  _listRubrics(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)
    
    this.engine.listRubrics(filters, options).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    List entity classes with given filters and options
  */
  _listClasses(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)
    
    this.engine.listClasses(filters, options).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    List facets with given rubrics
  */
  _listFacets(req, res, next) {
    let facets = req.query.facets || {}
    let training = req.query.training || false

    if(!isEmpty(facets)) facets = JSON.parse(facets)
    
    this.engine.listFacets(facets, training).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  _updateSource(req, res, next) {
    let documentId = req.params.id
    let sourceData = req.body
    this.sourceEngine.updateSource(documentId, sourceData).then(function() {
      res.json(null)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Import external data
  */
  _import(req, res, next) {
    let file = req.query.file || ''
    let classes = req.query.classes.split(',') || []
    let importer = req.query.importer

    if(importer === 'opencorpora') {
      this.importEngine.openCorporaImporter(file, classes).then(function(result) {
        if(!result) result = {status: 'ok'}
        res.json(result)
      }).catch(function(err) {
        return next(err)
      })
    } else {
      return next(new Error('wrong importer: ' + importer))
    }
  }

  _convertTrainingDocs(req, res, next) {
    res.send('conversion requested')
    this.sourceEngine.convertTrainingDocs().then(function() {
      //res.send('done');
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Create Entity
  */
  _createEntity(req, res, next) {
    let entityData = req.body
    this.engine.createEntity(entityData).then(function(entity) {
      res.json(entity)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Get Entity
  */
  _getEntity(req, res, next) {
    let entityId = req.params.id
    this.engine.getEntity(entityId).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Update Entity
  */
  _updateEntity(req, res, next) {
    let entityId = req.params.id
    let entityData = req.body
    this.engine.updateEntity(entityId, entityData).then(function() {
      res.json(null)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    List entities with given filters and options
  */
  _listEntities(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)
    
    this.engine.listEntities(filters, options).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Search Entity
  */
  _searchEntity(req, res, next) {
    let pattern = req.query.value
    let restrictions = JSON.parse(req.query.restrictions)
    this.engine.findEntity(pattern, restrictions).then(function(results) {
      res.json(results)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Create Collection
  */
  _createCollection(req, res, next) {
    let collectionData = req.body
    this.engine.createCollection(collectionData).then(function(collection) {
      res.json(collection)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Get Collection
  */
  _getCollection(req, res, next) {
    let collectionId = req.params.id
    this.engine.getCollection(collectionId).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Update Collection
  */
  _updateCollection(req, res, next) {
    let collectionId = req.params.id
    let collectionData = req.body
    this.engine.updateCollection(collectionId, collectionData).then(function() {
      res.json(null)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    List collections with given filters and options
  */
  _listCollections(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)
    
    this.engine.listCollections(filters, options).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Search Collection
  */
  _searchCollection(req, res, next) {
    let pattern = req.query.value
    let restrictions = JSON.parse(req.query.restrictions)
    this.engine.findCollection(pattern, restrictions).then(function(results) {
      res.json(results)
    }).catch(function(err) {
      return next(err)
    })
  }
}

module.exports = MproServer
