let Promise = require('bluebird')
var ProgressBar = require('progress');
let DocumentSession = require('substance').DocumentSession
let JSONConverter = require('substance').JSONConverter
let each = require('lodash/each')
let uniq = require('lodash/uniq')
let Database = require('../packages/common/Database')
let Configurator = require('../packages/common/ServerConfigurator')
let StorePackage = require('../packages/store/package')
let ArticlePackage = require('../packages/server/cjs/article/package')
let VkPackage = require('../packages/server/cjs/vk/package')
let converter = new JSONConverter()

let configurator = new Configurator().import(StorePackage)
let articleConfigurator = new Configurator().import(ArticlePackage)
let vkConfigurator = new Configurator().import(VkPackage)
let db = new Database()
configurator.addConfigurator('mpro-article', articleConfigurator)
configurator.addConfigurator('mpro-vk', vkConfigurator)
configurator.setDBConnection(db)

let documentStore = configurator.getStore('document')

/* CONFIGURATION */

let stepSize = 2


/* ------------- */

function getTotal() {
  return new Promise(function(resolve, reject) {
    documentStore.listDocuments({training: false}, {limit: 1}, function(err, docs) {
      if(err) return reject(err)
      let total = docs.total
      resolve(total)
    })
  })
}

function getList(limit, offset) {
  return new Promise(function(resolve, reject) {
    documentStore.listDocuments({training: false}, {limit: limit, offset: offset, columns: ['document_id', 'schema_name']}, function(err, docs) {
      if(err) return reject(err)
      let records = docs.records
      resolve(records)
    })
  })
}

function getDocument(docId) {
  return new Promise(function(resolve, reject) {
    documentStore.getDocument(docId, function(err, doc) {
      if(err) return reject(err)
      let content = doc.content
      resolve(content)
    })
  })
}

function extractMeta(data, schema) {
  return new Promise(function(resolve) {
    let config = configurator.getConfigurator(schema)
    let emptyDoc = config.createArticle()
    let doc = converter.importDocument(emptyDoc, data)
    let session = new DocumentSession(doc)
    let entities = []
    let entityAnnos = doc.getIndex('annotations').byType.entity
    each(entityAnnos, function(anno) {
      entities.push(anno.reference)
    })
    entities = uniq(entities)

    session.transaction(function(tx, args) {
      tx.set(['meta', 'entities'], entities)
      return args
    })

    let meta = doc.get('meta')

    let result = {
      content: converter.exportDocument(doc),
      meta: meta,
      entities: entities
    }
    
    resolve(result)
  })
}

function saveDocument(docId, data) {
  return new Promise(function(resolve, reject) {
    documentStore.updateDocument(docId, data, function(err) {
      if(err) return reject(err)
      resolve()
    })
  })
}

function promiseWhile(predicate, action) {
  function loop() {
    if (!predicate()) return
    return Promise.resolve(action()).then(loop)
  }
  return Promise.resolve().then(loop)
}


getTotal()
  .then(function(total) {
    let i = 0
    let totalN = parseInt(total, 10);
    let bar = new ProgressBar('  converting [:bar] :percent :current :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: totalN
    })

    return promiseWhile(function(){return i <= total}, function() {
      return getList(2, i)
        .then(function(docs) {
          return Promise.map(docs, function(item) {
            let schema = item.schema_name
            return getDocument(item.document_id)
              .then(function(content) {
                return extractMeta(content, schema)
              })
              .then(function(data) {
                return saveDocument(item.document_id, data)
              })
          }, {concurrency: 10}).then(function() {
            i += stepSize
            bar.tick(stepSize)
          })
        })
    })
    .then(function(){
      db.shutdown()
    })
  })