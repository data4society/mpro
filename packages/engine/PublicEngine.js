let Err = require('substance').SubstanceError
let Promise = require('bluebird')
let extend = require('lodash/extend')
let isEmpty = require('lodash/isEmpty')
let isUndefined = require('lodash/isUndefined')

/*
  Implements the MPro Engine API.
*/
class PublicEngine {
  constructor(config) {
    this.db = config.db
    this.config = config
    this.apiStore = config.apiStore
    this.documentStore = config.documentStore
  }

  handleApiRequest(key, query, format, options) {
    ///let app_id, format, api
    return this.apiStore.getApi(key).then(function(apiRecord) {
      if(!apiRecord.live) {
        return new Error("Access denied")
      }

      if(apiRecord.format === 'iframe' && !format) {
        return apiRecord
      }

      if(apiRecord.api === 'collection_docs') {
        return this._collectionDocuments(query, apiRecord.app_id, options)
      } else if (apiRecord.api === 'entity_docs') {
        return this._entityDocuments(apiRecord.param, query, apiRecord.app_id, options)
      } else if (apiRecord.api === 'collections_list') {
        return this._collectionsFacets(query, apiRecord.app_id)
      } else if (apiRecord.api === 'entities_list') {
        return this._entitiesFacets(query, apiRecord.app_id)
      } else if (apiRecord.api === 'get_document') {
        return this._getDocument(query, apiRecord.app_id)
      } else {
        return new Error("Access denied")
      }

      // app_id = apiRecord.app_id,
      // format = apiRecord.format,
      // api = api
    }.bind(this))
  }

  _collectionDocuments(col_id, app, opts) {
    let filters = {
      'collections &&': col_id.split(','),
      app_id: app
    }
    let columns = [
      'document_id AS doc_id', 
      "json_build_object('title', meta->>'title', 'abstract', meta->>'abstract', 'published', meta->>'published', 'source', meta->>'source', 'publisher', meta->>'publisher') AS meta"
    ]
    if(opts.entities) {
      columns.push("(SELECT array(SELECT json_build_object('name', name, 'id', entity_id) FROM unnest(entities) entity LEFT JOIN entities e on e.entity_id=entity)) AS entities")
    }
    let options = extend({}, opts, {columns: columns, order: 'created desc'})
    return new Promise(function(resolve, reject) {
      this.documentStore.listDocuments(filters, options, function(err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    }.bind(this))
  }

  _entityDocuments(prop, value, app, opts) {
    if(prop.split(', ').length > 1) {
      let path = prop.split(', ');
      path[1] = "'" + path[1] + "'"
      prop = path.join('->>')
    }
    let offset = opts.offset || 0
    let limit = opts.limit || 10

    let columns = [
      'r.document_id AS doc_id', 
      "json_build_object('title', r.meta->>'title', 'abstract', r.meta->>'abstract', 'published', r.meta->>'published', 'source', r.meta->>'source', 'publisher', r.meta->>'publisher') AS meta",
      'e.name',
      'e.entity_id'
    ]
    if(opts.entities) {
      columns.push("(SELECT array(SELECT json_build_object('name', name, 'id', entity_id) FROM unnest(r.entities) entity LEFT JOIN entities e on e.entity_id=entity)) AS entities")
    }
    columns = columns.join(',')

    let sql = `SELECT ${columns} 
      FROM records r 
      JOIN entities e
      ON entity_id = ANY(r.entities)
      WHERE ${prop} = '${value}'
      AND r.app_id = '${app}'
      OFFSET ${offset}
      LIMIT ${limit}`;

    let countSql = `SELECT COUNT(r.document_id)
      FROM records r 
      JOIN entities e
      ON entity_id = ANY(r.entities)
      WHERE ${prop} = '${value}'
      AND r.app_id = '${app}'`;

    return new Promise(function(resolve, reject) {
      let result = {}
      
      this.db.run(countSql, [], function(err, total) {
        if(err) {
          return reject(new Err('PublicEngine.EntityDocumentsApi', {
            cause: err
          }))
        }

        result.total = total[0].count

        this.db.run(sql, [], function(err, res) {
          if(err) {
            return reject(new Err('PublicEngine.EntityDocumentsApi', {
              cause: err
            }))
          }

          result.records = res

          resolve(result)
        
        })
      
      }.bind(this))
    }.bind(this))
  }

  _collectionsFacets(value, app_id) {
    let collections = !isEmpty(value) ? JSON.parse('[' + value + ']') : [] 
    let sql = `SELECT collection, cnt, collections.name FROM (
      SELECT DISTINCT
        unnest(records.collections) AS collection,
        COUNT(*) OVER (PARTITION BY unnest(records.collections)) cnt
      FROM records WHERE $1 <@ collections AND app_id = $2
    ) AS docs INNER JOIN collections ON (docs.collection = collections.collection_id::text) WHERE collections.public = true AND app_id = $2;`

    return new Promise(function(resolve, reject) {

      this.db.run(sql, [collections, app_id], function(err, res) {
        if(err) {
          return reject(new Err('PublicEngine.CollectionsFacetsApi', {
            cause: err
          }))
        }

        resolve(res)
      
      })
      
    }.bind(this))
  }

  _entitiesFacets(value, app_id) {
    let collections = !isEmpty(value) ? JSON.parse('[' + value + ']') : [] 
    let sql = `SELECT id, cnt, e.name FROM (
      SELECT DISTINCT
        unnest(records.entities) AS id,
      COUNT(*) OVER (PARTITION BY unnest(entities)) cnt
      FROM records WHERE $1 <@ collections AND app_id = $2
    ) AS docs INNER JOIN entities e ON (id = e.entity_id) ORDER BY cnt DESC LIMIT 10;`

    return new Promise(function(resolve, reject) {

      this.db.run(sql, [collections, app_id], function(err, res) {
        if(err) {
          return reject(new Err('PublicEngine.CollectionsFacetsApi', {
            cause: err
          }))
        }

        resolve(res)
      
      })
      
    }.bind(this))
  }

  _getDocument(doc_id, app_id) {
    return new Promise(function(resolve, reject) {
      this.db.records.findOne({document_id: doc_id, app_id: app_id}, {columns: ['document_id', 'meta']}, function(err, result) {
        if (err) return reject(err)
        if(isUndefined(result)) {
          return reject(new Err('PublicEngine.GetDocument', {
            message: 'There is no document with id ' + doc_id + ' in ' + app_id + ' app'
          }))
        }
        resolve(result)
      })
    }.bind(this))
  }
}

module.exports = PublicEngine
