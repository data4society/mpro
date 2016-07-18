'use strict';

var substanceTest = require('substance/test/test').module('server/SourceStore');

var Database = require('../../server/Database');
var SourceStore = require('../../server/SourceStore');
var UserStore = require('../../server/UserStore');

var db, sourceStore, userStore;

function setup() {
  db = new Database();
  return db.reset()
    .then(function() {
      userStore = new UserStore({db: db});
      return userStore.seed();
    })
    .then(function() {
      sourceStore = new SourceStore({ db: db });
      return sourceStore.seed();
    }).then(function(){
      // we have to shutdown db connection and establish test again one time
      // so massive will have all methods attached to test's DB object
      // if we will not do test massive will not have methods atatched to table
      // because there was no tables when we started first unit test
      db.connection.end();
      db = new Database();
      sourceStore = new SourceStore({ db: db });
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
  Create source document
*/

test('Should return new document source record with given data', function(t) {
  var sourceData = {
    title: 'Test'
  };
  return sourceStore.createSource(sourceData)
    .then(function(source) {
      t.isNotNil(source.doc_id, 'Source doc_id should exists');
      t.equal(source.title, sourceData.title, 'Source title should equals title from arguments');
      t.end();
    });
});

test('Should return new document source record with given id', function(t) {
  var sourceData = {
    doc_id: "non-existing-rubric"
  };
  return sourceStore.createSource(sourceData)
    .then(function(source) {
      t.isNotNil(source.doc_id, 'Source doc_id should exists');
      t.equal(source.doc_id, sourceData.doc_id, 'Source doc_id should equals doc_id from arguments');
      t.end();
    });
});

test('Should return error if document source with given doc_id already exist', function(t) {
  var sourceData = {
    doc_id: '68c14a78-d02b-454d-88ce-6948d27fce09'
  };
  return sourceStore.createSource(sourceData)
    .then(function(source) {
      t.isNil(source, 'Source should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'Document source ' + sourceData.doc_id + ' already exists.', 'Error message should equals to given one');
      t.end();
    });
});

/*
  Get source document
*/

test('Should return document source record with given id', function(t) {
  var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';
  return sourceStore.getSource(sourceId)
    .then(function(source) {
      t.equal(source.doc_id, sourceId, 'Source doc_id should equals sourceId from arguments');
      t.end();
    });
});

test('Should return error if document source with given id does not exist', function(t) {
  var sourceId = 'non-existing-document-source';
  return sourceStore.getSource(sourceId)
    .then(function(source) {
      t.isNil(source, 'Source should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No document source found for doc_id ' + sourceId, 'Error message should equals to given one');
      t.end();
    });
});

/*
  Update document source
*/

test('Should update document source and return updated record', function(t) {
  var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';
  var data = {
    title: 'Test document'
  };

  return sourceStore.updateSource(sourceId, data)
    .then(function(source) {
      t.isNotNil(source, 'Source should exists');
      t.equal(source.doc_id, sourceId, 'Source doc_id should equals sourceId from arguments');
      t.equal(source.title, data.title, 'Source title should equals title from arguments');
      return sourceStore.getSource(sourceId);
    })
    .then(function(source) {
      t.isNotNil(source, 'Source should exists');
      t.equal(source.doc_id, sourceId, 'Source doc_id should equals sourceId from arguments');
      t.equal(source.title, data.title, 'Source title should equals title from arguments');
      t.end();
    });
});

/*
  Delete document source
*/

test('Should delete document source and return deleted record for a last time', function(t) {
  var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';

  return sourceStore.deleteSource(sourceId)
    .then(function(source) {
      t.isNotNil(source, 'Source should exists');
      t.equal(source.doc_id, sourceId, 'Source doc_id should equals sourceId from arguments');
      return sourceStore.getSource(sourceId);
    })
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No document source found for doc_id ' + sourceId, 'Error message should equals to given one');
      t.end();
    });
});

test('Should return error in case of non-existing record', function(t) {
  var sourceId = 'non-existing-document-source';

  return sourceStore.deleteSource(sourceId)
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'Document source with doc_id ' + sourceId + ' does not exists', 'Error message should equals to given one');
      t.end();
    });
});

/*
  Document existance
*/

test('Should return true in case of existed record', function(t) {
  var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';

  return sourceStore.sourceExists(sourceId)
    .then(function(exist) {
      t.equal(exist, true, 'Source should exists');
      t.end();
    });
});

test('Should return false in case of non-existed record', function(t) {
  var sourceId = 'non-existing-document-source';

  return sourceStore.sourceExists(sourceId)
    .then(function(exist) {
      t.equal(exist, false, 'Source should not exists');
      t.end();
    });
});