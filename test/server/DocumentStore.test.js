let testModule = require('substance-test').module

let Configurator = require('../../packages/common/ServerConfigurator')
let Database = require('../../packages/common/Database')
let StorePackage = require('../../packages/store/package')

const substanceTest = testModule('collab/DocumentStore')

let configurator = new Configurator().import(StorePackage)
let documentStore

function setup() {
  let db = new Database()
  configurator.setDBConnection(db)

  return db.reset()
    .then(function() {
      let userStore = configurator.getStore('user')
      return userStore.seed()
    })
    .then(function() {
      documentStore = configurator.getStore('document')
      return documentStore.seed()
    })
}

function teardown() {
  let db = configurator.getDBConnection()
  db.end()
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

test('Should сreate and return a new document', function(t) {
  let newDoc = {
    documentId: 'new-doc',
    title: 'test document',
    schema_version: '1.0.0',
    info: {
      custom: 'some custom data',
      schemaName: 'mpro-article',
    }
  }

  documentStore.createDocument(newDoc, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc, 'Document should exists')
    t.isNotNil(doc.documentId, 'Document should have document id')
    t.equal(doc.documentId, newDoc.document_id, 'Document id should equals documentId of passed document')
    t.equal(doc.title, newDoc.title, 'Title should equals title of passed document')
    t.equal(doc.schema_name, newDoc.info.schemaName, 'Schema name should equals schemaName of passed document')
    t.equal(doc.schema_version, newDoc.schema_version, 'Schema version should equals schema_version of passed document')
    t.equal(doc.version, 1, 'Version should equals 1')
    t.deepEqual(doc.info, newDoc.info, 'Info should equals info of passed document')
    t.end()
  })
})

test('Should create and return a new document without providing a documentId', function(t) {
  let newDoc = {
    title: 'test document',
    schema_name: 'mpro-article',
    schema_version: '1.0.0',
    info: {
      custom: 'some custom data'
    }
  }

  documentStore.createDocument(newDoc, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc, 'Document should exists')
    t.isNotNil(doc.documentId, 'Document should have document id')
    t.end()
  })
})

test('Should not allow to create a new document with already existing id', function(t) {
  let newDoc = {
    documentId: '1',
    title: 'test document',
    schema_name: 'mpro-article',
    schema_version: '1.0.0',
    info: {
      custom: 'some custom data'
    }
  }

  documentStore.createDocument(newDoc, function(err, doc) {
    t.isNotNil(err, 'Should error')
    t.isNil(doc, 'Document should not exists')
    t.equal(err.message, 'Document ' + newDoc.documentId + ' already exists.', 'Error message should equals to given one')
    t.end()
  })
})

/*
  Get document
*/

test('Should return document record with given id', function(t) {
  let documentId = '1'

  documentStore.getDocument(documentId, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc, 'Document should exists')
    t.equal(doc.document_id, documentId, 'Document id should equals documentId from argument')
    t.end()
  })
})

test('Should return error if document with given id does not exist', function(t) {
  let documentId = 'non-existing-doc'

  documentStore.getDocument(documentId, function(err, doc) {
    t.isNotNil(err, 'Should error')
    t.isNil(doc, 'Document should not exists')
    t.equal(err.message, 'No document found for documentId ' + documentId, 'Error message should equals to given one')
    t.end()
  })
})

/*
  Update document
*/

test('Should update document and return updated record', function(t) {
  let documentId = '1'
  let data = {
    schema_name: 'mpro-blog',
    schema_version: '2.0.0',
    info: {
      title: 'new title'
    }
  }

  documentStore.updateDocument(documentId, data, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc, 'Document should exists')
    t.equal(doc.document_id, documentId, 'Document id should equals documentId of passed document')
    t.equal(doc.title, data.info.title, 'Title should equals title of passed document')
    t.equal(doc.schema_name, data.schema_name, 'Schema name should equals schemaName of passed document')
    t.equal(doc.schema_version, data.schema_version, 'Schema version should equals schema_version of passed document')
    t.deepEqual(doc.info, data.info, 'Info should equals info of passed document')
    t.end()
  })
})

test('Should return error if document with given id does not exist', function(t) {
  let documentId = 'non-existing-doc'
  let data = {
    schema_name: 'mpro-blog',
    schema_version: '2.0.0',
    info: {
      title: 'new title'
    }
  }

  documentStore.updateDocument(documentId, data, function(err, doc) {
    t.isNotNil(err, 'Should error')
    t.isNil(doc, 'Document should not exists')
    t.equal(err.message, 'Document with documentId ' + documentId + ' does not exists', 'Error message should equals to given one')
    t.end()
  })
})

/*
  Delete document
*/

test('Should delete entity and return deleted record for a last time', function(t) {
  let documentId = '1'

  documentStore.deleteDocument(documentId, function(err, doc) {
    t.isNil(err, 'Should not error')
    t.isNotNil(doc, 'Document should exists')
    t.equal(doc.document_id, documentId, 'Document id should equals documentId from argument')

    documentStore.getDocument(documentId, function(err, doc) {
      t.isNotNil(err, 'Should error')
      t.isNil(doc, 'Document should not exists')
      t.equal(err.message, 'No document found for documentId ' + documentId, 'Error message should equals to given one')
      t.end()
    })
  })
})

test('Should return error if document with given id does not exist', function(t) {
  let documentId = 'non-existing-doc'

  documentStore.deleteDocument(documentId, function(err, doc) {
    t.isNotNil(err, 'Should error')
    t.isNil(doc, 'Document should not exists')
    t.equal(err.message, 'Document with documentId ' + documentId + ' does not exists', 'Error message should equals to given one')
    t.end()
  })
})

/*
  Document existance
*/

test('Should return true if document is existing', function(t) {
  let documentId = '1'

  documentStore.documentExists(documentId, function(err, exist) {
    t.isNil(err, 'Should not error')
    t.isNotNil(exist, 'Exists param should exists')
    t.equal(exist, true, 'Document should exists')
    t.end()
  })
})

test('Should return false if document is not existing ', function(t) {
  let documentId = 'non-existing-doc'

  documentStore.documentExists(documentId, function(err, exist) {
    t.isNil(err, 'Should not error')
    t.isNotNil(exist, 'Exists param should exists')
    t.equal(exist, false, 'Document should not exists')
    t.end()
  })
})

/*
  Document listing
*/

test('Should return list of documents', function(t) {
  documentStore.listDocuments({}, {}, function(err, results) {
    t.isNil(err, 'Should not error')
    t.isNotNil(results, 'Results should exists')
    t.equal(results.total, '3', 'Results counter should be equal 3')
    t.equal(results.records[0].schema_name, 'mpro-article', 'Schema name of first records should be mpro-article')
    t.equal(results.records[0].schema_version, '1.0.0', 'Schema version of first records should be 1.0.0')
    t.end()
  })
})

test('Should return list of documents with matching filters', function(t) {
  let filters = {
    edited_by: 'testuser2'
  } 

  documentStore.listDocuments(filters, {}, function(err, results) {
    t.isNil(err, 'Should not error')
    t.isNotNil(results, 'Results should exists')
    t.equal(results.total, '2', 'Results counter should be equal 2')
    t.equal(results.records[0].edited_by, filters.edited_by, 'Record should contain filtered property')
    t.end()
  })
})

test('Should return list of documents with applied options', function(t) {
  let filters = {
    edited_by: 'testuser2'
  }

  let options = {
    limit: 1
  }

  documentStore.listDocuments(filters, options, function(err, results) {
    t.isNil(err, 'Should not error')
    t.isNotNil(results, 'Results should exists')
    t.equal(results.total, '2', 'Results counter should be equal 2')
    t.equal(results.records.length, 1, 'Results should contains 1 record')
    t.equal(results.records[0].edited_by, filters.edited_by, 'Record should contain filtered property')
    t.end()
  })
})

test('Should return empty list of documents with filters that does not match', function(t) {
  let filters = {
    edited_by: 'non-existing-user'
  }

  documentStore.listDocuments(filters, {}, function(err, results) {
    t.isNil(err, 'Should not error')
    t.isNotNil(results, 'Results should exists')
    t.equal(results.total, '0', 'Results counter should equals 0')
    t.equal(results.records.length, 0, 'Results should not contains records')
    t.end()
  })
})