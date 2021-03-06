let isEmpty = require('lodash/isEmpty')

/*
  MPro Server module. Bound to an express instance.
*/
class MproServer {
  constructor(config) {
    this.authEngine = config.authEngine
    this.engine = config.mproEngine
    this.importEngine = config.importEngine
    this.sourceEngine = config.sourceEngine
    this.path = config.path
  }

  /*
    Attach this server to an express instance
  */
  bind(app) {
    app.get(this.path + '/config', this._getConfig.bind(this))
    app.get(this.path + '/filters', this.authEngine.hasAccess.bind(this.authEngine), this._getFilterValues.bind(this))
    app.get(this.path + '/classes', this.authEngine.hasAccess.bind(this.authEngine), this._listClasses.bind(this))
    app.get(this.path + '/facets', this.authEngine.hasAccess.bind(this.authEngine), this._listFacets.bind(this))
    app.get(this.path + '/import', this._import.bind(this))

    app.post(this.path + '/sources', this.authEngine.hasAccess.bind(this.authEngine), this._createSource.bind(this))
    app.put(this.path + '/sources/:id', this.authEngine.hasAccess.bind(this.authEngine), this._updateSource.bind(this))
    // Convert all accepted documents
    app.get(this.path + '/sources/training', this.authEngine.hasAccess.bind(this.authEngine), this._convertTrainingDocs.bind(this))
    // Collections CRUD
    app.post(this.path + '/collections', this.authEngine.hasAccess.bind(this.authEngine), this._createCollection.bind(this))
    app.get(this.path + '/collections', this.authEngine.hasAccess.bind(this.authEngine), this._listCollections.bind(this))
    app.get(this.path + '/collections/search', this.authEngine.hasAccess.bind(this.authEngine), this._searchCollection.bind(this))
    app.get(this.path + '/collections/:id', this.authEngine.hasAccess.bind(this.authEngine), this._getCollection.bind(this))
    app.put(this.path + '/collections/:id', this.authEngine.hasAccess.bind(this.authEngine), this._updateCollection.bind(this))
    // Entities CRUD
    app.post(this.path + '/entities', this.authEngine.hasAccess.bind(this.authEngine), this._createEntity.bind(this))
    app.get(this.path + '/entities', this.authEngine.hasAccess.bind(this.authEngine), this._listEntities.bind(this))
    app.get(this.path + '/entities/search', this.authEngine.hasAccess.bind(this.authEngine), this._searchEntity.bind(this))
    app.get(this.path + '/entities/:id', this.authEngine.hasAccess.bind(this.authEngine), this._getEntity.bind(this))
    app.put(this.path + '/entities/:id', this.authEngine.hasAccess.bind(this.authEngine), this._updateEntity.bind(this))
    // Rubrics CRUD
    app.post(this.path + '/rubrics', this.authEngine.hasAccess.bind(this.authEngine), this._createRubric.bind(this))
    app.get(this.path + '/rubrics', this.authEngine.hasAccess.bind(this.authEngine), this._listRubrics.bind(this))
    app.get(this.path + '/rubrics/:id', this.authEngine.hasAccess.bind(this.authEngine), this._getRubric.bind(this))
    app.put(this.path + '/rubrics/:id', this.authEngine.hasAccess.bind(this.authEngine), this._updateRubric.bind(this))
    // Rules CRUD
    app.post(this.path + '/rules', this.authEngine.hasAccess.bind(this.authEngine), this._createRule.bind(this))
    app.get(this.path + '/rules', this.authEngine.hasAccess.bind(this.authEngine), this._listRules.bind(this))
    app.get(this.path + '/rules/:id/reapply', this.authEngine.hasAccess.bind(this.authEngine), this._reapplyRule.bind(this))
    app.get(this.path + '/rules/:id', this.authEngine.hasAccess.bind(this.authEngine), this._getRule.bind(this))
    app.put(this.path + '/rules/:id', this.authEngine.hasAccess.bind(this.authEngine), this._updateRule.bind(this))
    app.delete(this.path + '/rules/:id', this.authEngine.hasAccess.bind(this.authEngine), this._removeRule.bind(this))
    // Public APIs CRUD
    app.post(this.path + '/apis', this.authEngine.hasAccess.bind(this.authEngine), this._createApi.bind(this))
    app.get(this.path + '/apis', this.authEngine.hasAccess.bind(this.authEngine), this._listApis.bind(this))
    app.get(this.path + '/apis/:key', this.authEngine.hasAccess.bind(this.authEngine), this._getApi.bind(this))
    app.put(this.path + '/apis/:key', this.authEngine.hasAccess.bind(this.authEngine), this._updateApi.bind(this))
    app.delete(this.path + '/apis/:key', this.authEngine.hasAccess.bind(this.authEngine), this._removeApi.bind(this))
  }

  _getConfig(req, res, next) {
    this.engine.getConfig().then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  _getFilterValues(req, res, next) {
    let filters = req.query.filters || {}
    let source = req.query.source

    if(!isEmpty(filters)) filters = JSON.parse(filters)

    this.engine.getFilterValues(filters, source)
      .then(function(result) {
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

  _createSource(req, res, next) {
    let sourceData = req.body
    this.sourceEngine.createSource(sourceData).then(function(source) {
      res.json(source)
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
    Create Rubric
  */
  _createRubric(req, res, next) {
    let rubricData = req.body
    this.engine.createRubric(rubricData).then(function(rubric) {
      res.json(rubric)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Get Rubric
  */
  _getRubric(req, res, next) {
    let rubricId = req.params.id
    this.engine.getRubric(rubricId).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Update Rubric
  */
  _updateRubric(req, res, next) {
    let rubricId = req.params.id
    let rubricData = req.body
    this.engine.updateRubric(rubricId, rubricData).then(function() {
      res.json(null)
    }).catch(function(err) {
      return next(err)
    })
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

  /*
    Create Rule
  */
  _createRule(req, res, next) {
    let rulesData = req.body
    this.engine.createRule(rulesData).then(function(rule) {
      res.json(rule)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Get Rule
  */
  _getRule(req, res, next) {
    let ruleId = req.params.id
    this.engine.getRule(ruleId).then(function(rule) {
      res.json(rule)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Update Rule
  */
  _updateRule(req, res, next) {
    let ruleId = req.params.id
    let ruleData = req.body
    this.engine.updateRule(ruleId, ruleData).then(function() {
      res.json(null)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Remove Rule
  */
  _removeRule(req, res, next) {
    let ruleId = req.params.id
    this.engine.removeRule(ruleId).then(function(rule) {
      res.json(rule)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    List rules with given filters and options
  */
  _listRules(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)

    this.engine.listRules(filters, options).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Reapply Rule
  */
  _reapplyRule(req, res, next) {
    let ruleId = req.params.id
    this.engine.reapplyRule(ruleId).then(function() {
      res.json(200)
    }).catch(function(err) {
      return next(err)
    })
  }


  /*
    Create Public API
  */
  _createApi(req, res, next) {
    let apiData = req.body
    this.engine.createApi(apiData).then(function(api) {
      res.json(api)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Get Public API
  */
  _getApi(req, res, next) {
    let key = req.params.key
    this.engine.getApi(key).then(function(api) {
      res.json(api)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Update Public API
  */
  _updateApi(req, res, next) {
    let key = req.params.key
    let apiData = req.body
    this.engine.updateApi(key, apiData).then(function() {
      res.json(null)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    Remove Public API
  */
  _removeApi(req, res, next) {
    let key = req.params.key
    this.engine.removeApi(key).then(function(api) {
      res.json(api)
    }).catch(function(err) {
      return next(err)
    })
  }

  /*
    List Public APIs with given filters and options
  */
  _listApis(req, res, next) {
    let filters = req.query.filters || {}
    let options = req.query.options || {}

    if(!isEmpty(filters)) filters = JSON.parse(filters)
    if(!isEmpty(options)) options = JSON.parse(options)

    this.engine.listApis(filters, options).then(function(result) {
      res.json(result)
    }).catch(function(err) {
      return next(err)
    })
  }

}

module.exports = MproServer
