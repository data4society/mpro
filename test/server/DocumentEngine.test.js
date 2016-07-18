'use strict';

var substanceTest = require('substance/test/test').module('server/DocumentEngine');

var Database = require('../../server/Database');
var DocumentEngine = require('../../server/MproDocumentEngine');
var ChangeStore = require('../../server/ChangeStore');
var DocumentStore = require('../../server/DocumentStore');
var UserStore = require('../../server/UserStore');

/*
  Config
*/
var ServerConfigurator = require('../../packages/server/ServerConfigurator');
var ServerPackage = require('../../packages/server/package');
var configurator = new ServerConfigurator().import(ServerPackage);
var schemas = configurator.getSchemas();

var db, documentEngine, userStore, documentStore, changeStore;

function setup() {
  db = new Database();
  return db.reset()
    .then(function() {
      userStore = new UserStore({db: db});
      return userStore.seed();
    })
    .then(function() {
      documentStore = new DocumentStore({ db: db });
      return documentStore.seed();
    })
    .then(function() {
      changeStore = new ChangeStore({ db: db });
      return changeStore.seed();
    }).then(function(){
      documentEngine = new DocumentEngine({
        changeStore: changeStore,
        documentStore: documentStore,
        schemas: schemas
      });
      // we have to shutdown db connection and establish it again one time
      // so massive will have all methods attached to it's DB object
      // if we will not do it massive will not have methods atatched to table
      // because there was no tables when we started first unit test
      db.connection.end();
      db = new Database();
    });
}

function teardown() {
  db.connection.end();
}

function test(description, fn) {
  substanceTest(description, function (t) {
    setup().then(function(){
      t.once('end', teardown);
      fn(t);
    });
  });
}

/*
  Create document
*/

test('Should create a new document', function(t) {
  var args = {
    documentId: 'new-doc',
    schemaName: 'mpro-article'
  };

  documentEngine.createDocument(args, function(err, doc) {
    t.isNil(err, 'Should not error');
    t.equal(doc.documentId, args.documentId, 'Document id should equals documentId from argument');
    t.isNotNil(doc.data, 'Document data should exists');
    t.equal(doc.data.schema.name, args.schemaName, 'Schema name should equals schemaName from argument');
    t.end();
  });
});

test('Should create a new document without documentId provided', function(t) {
  var args = {
    schemaName: 'mpro-article'
  };

  documentEngine.createDocument(args, function(err, doc) {
    t.isNil(err, 'Should not error');
    t.isNotNil(doc.data, 'Document data should exists');
    t.isNotNil(doc.documentId, 'Document id should exists');
    t.end();
  });
});

/*
  Create change
*/

test('Should not allow adding a change to non existing document', function(t) {
  var args = {
    documentId: 'some-non-existent-doc',
    change: {'some': 'change'}
  };

  documentEngine.addChange(args, function(err, version) {
    t.isNotNil(err, 'Should error');
    t.isNil(version, 'Version should not exists');
    t.end();
  });
});

test('Should add a new change to existing document', function(t) {
  var args = {
    documentId: '1',
    change: {'some': 'change'}
  };

  documentEngine.addChange(args, function(err, version) {
    t.isNil(err, 'Should not error');
    t.isNotNil(version, 'Version should exists');
    t.equal(version, 5, 'Version should be 5');

    var args = {
      documentId: '1',
      sinceVersion: 0
    };

    documentEngine.getChanges(args, function(err, result) {
      t.equal(result.changes.length, 5, 'Should return 5 changes');
      t.equal(result.version, 5, 'Version should be 5');

      documentEngine.documentStore.getDocument('1', function(err, doc) {
        t.equal(doc.version, 5, 'Version should be 5');
        t.end();
      });
    });
  });
});

/*
  Read document
*/

test('Document should be valid', function(t) {
  var documentId = '1';

  documentEngine.getDocument({documentId: documentId}, function(err, doc) {
    t.isNil(err, 'Should not error');
    t.isNotNil(doc.data, 'Document data should exists');
    t.isNotNil(doc.documentId, 'Document id should exists');
    t.equal(doc.version, 4, 'Version should be 4');
    t.end();
  });
});

test('Should return right version', function(t) {
  documentEngine.getVersion('1', function(err, version) {
    t.isNil(err, 'Should not error');
    t.isNotNil(version, 'Version should exists');
    t.equal(version, 4, 'Version should be 4');
    t.end();
  });
});

/*
  Read changes
*/

test('Changes should be valid', function(t) {
  var args = {
    documentId: '1',
    sinceVersion: 0
  };

  documentEngine.getChanges(args, function(err, result) {
    t.isNil(err, 'Should not error');
    t.isNotNil(result, 'Result should exists');
    t.equal(result.changes.length, 4, 'Should return 4 changes');
    t.equal(result.version, 4, 'Version should be 4');
    t.end();
  });
});

/*
  Remove document
*/

test('Should remove a document', function(t) {
  var documentId = '1';
  
  documentEngine.deleteDocument(documentId, function(err, doc) {  
    t.isNil(err, 'Should not error');
    t.equal(doc.documentId, documentId, 'Document id should equals documentId from argument');

    documentEngine.getDocument({documentId: documentId}, function(err, doc) {
      t.isNotNil(err, 'Should error');
      t.isNil(doc, 'Document should not exists');

      // Test if there are still changes for that doc after deletion
      var args = {
        documentId: documentId,
        sinceVersion: 0
      };
      documentEngine.getChanges(args, function(err) {
        t.isNotNil(err, 'Should error');

        documentEngine.changeStore.getChanges(args, function(err, result) {
          t.equal(result.changes.length, 0, 'Should be no changes');
          t.equal(result.version, 0, 'Version should be 0');
          t.end();
        });
      });
    });
  });
});