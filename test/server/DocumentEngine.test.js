let testModule = require('substance-test').module

let Configurator = require('../../packages/common/ServerConfigurator')
let Database = require('../../packages/common/Database')
let CJSpackage = require('../../packages/server/cjs/package')
let StorePackage = require('../../packages/store/package')
let DocumentEngine = require('../../packages/engine/MproDocumentEngine')
let SnapshotEngine = require('../../packages/engine/MproSnapshotEngine')

const substanceTest = testModule('collab/DocumentEngine')

let db = new Database()

let configurator = new Configurator().import(CJSpackage)
configurator.setDBConnection(db)
configurator.import(StorePackage)

let snapshotEngine = new SnapshotEngine({
  db: db,
  configurator: configurator,
  changeStore: configurator.getStore('change'),
  documentStore: configurator.getStore('document'),
  snapshotStore: configurator.getStore('snapshot')
})

let documentEngine = new DocumentEngine({
  db: db,
  configurator: configurator,
  changeStore: configurator.getStore('change'),
  documentStore: configurator.getStore('document'),
  snapshotEngine: snapshotEngine
})


function setup() {
  return db.reset()
    .then(function() {
      let userStore = configurator.getStore('user')
      return userStore.seed()
    })
    .then(function() {
      let documentStore = configurator.getStore('document')
      return documentStore.seed()
    })
    .then(function() {
      let changeStore = configurator.getStore('change')
      return changeStore.seed()
    })
}

function teardown() {
  db.shutdown()
}

function test(description, fn) {
  substanceTest(description, function (t) {
    setup().then(function(){
      t.once('end', teardown)
      fn(t)
    })
  })
}

/*
  Create document
*/

test('Should create a new document', function(t) {
  let args = {
    documentId: 'new-doc',
    schemaName: 'mpro-article'
  }

  documentEngine.createDocument(args, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.equal(doc.documentId, args.documentId, 'Document id should equals documentId from argument')
    t.isNotNil(doc, 'Document should exists')
    t.equal(doc.schemaName, args.schemaName, 'Schema name should equals schemaName from argument')
    t.end()
  })
})

test('Should create a new document without documentId provided', function(t) {
  let args = {
    schemaName: 'mpro-article'
  }

  documentEngine.createDocument(args, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc, 'Document data should exists')
    t.isNotNil(doc.documentId, 'Document id should exists')
    t.end()
  })
})

/*
  Create change
*/

test('Should not allow adding a change to non existing document', function(t) {
  let args = {
    documentId: 'some-non-existent-doc',
    change: {'some': 'change'}
  }

  documentEngine.addChange(args, function(err, version) {
    t.isNotNil(err, 'Should error')
    t.isNil(version, 'Version should not exists')
    t.end()
  })
})

test('Should add a new change to existing document', function(t) {
  let args = {
    documentId: '1',
    change: {'some': 'change'}
  }

  documentEngine.addChange(args, function(err, version) {
    t.isNil(err, 'Should not error')
    t.isNotNil(version, 'Version should exists')
    t.equal(version, 5, 'Version should be 5')

    let args = {
      documentId: '1',
      sinceVersion: 0
    }

    documentEngine.getChanges(args, function(err, result) {
      t.equal(result.changes.length, 5, 'Should return 5 changes')
      t.equal(result.version, 5, 'Version should be 5')

      documentEngine.documentStore.getDocument('1', function(err, doc) {
        t.equal(doc.version, 5, 'Version should be 5')
        t.end()
      })
    })
  })
})

/*
  Read document
*/

test('Document should be valid', function(t) {
  let documentId = '1'

  documentEngine.getDocument({documentId: documentId}, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc.data, 'Document data should exists')
    t.isNotNil(doc.documentId, 'Document id should exists')
    t.equal(doc.version, 4, 'Version should be 4')
    t.end()
  })
})

test('Should return right version', function(t) {
  documentEngine.getVersion('1', function(err, version) {
    t.isNil(err, 'Should not error')
    t.isNotNil(version, 'Version should exists')
    t.equal(version, 4, 'Version should be 4')
    t.end()
  })
})

/*
  Read changes
*/

test('Changes should be valid', function(t) {
  let args = {
    documentId: '1',
    sinceVersion: 0
  }

  documentEngine.getChanges(args, function(err, result) {
    t.isNil(err, 'Should not error')
    t.isNotNil(result, 'Result should exists')
    t.equal(result.changes.length, 4, 'Should return 4 changes')
    t.equal(result.version, 4, 'Version should be 4')
    t.end()
  })
})

/*
  Remove document
*/

test('Should remove a document', function(t) {
  let documentId = '1'
  
  documentEngine.deleteDocument(documentId, function(err, doc) {  
    t.isNil(err, 'Should not error')
    t.equal(doc.documentId, documentId, 'Document id should equals documentId from argument')

    documentEngine.getDocument({documentId: documentId}, function(err, doc) {
      t.isNotNil(err, 'Should error')
      t.isNil(doc, 'Document should not exists')

      // Test if there are still changes for that doc after deletion
      let args = {
        documentId: documentId,
        sinceVersion: 0
      }
      documentEngine.getChanges(args, function(err) {
        t.isNotNil(err, 'Should error')

        documentEngine.changeStore.getChanges(args, function(err, result) {
          t.equal(result.changes.length, 0, 'Should be no changes')
          t.equal(result.version, 0, 'Version should be 0')
          t.end()
        })
      })
    })
  })
})