var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var DocumentEngine = require('../../server/MproDocumentEngine');
var ChangeStore = require('../../server/ChangeStore');
var DocumentStore = require('../../server/DocumentStore');
var UserStore = require('../../server/UserStore');

var newArticle = require('../../model/newArticle');

describe('Document Engine', function() {
  var db = new Database();

  var changeStore = new ChangeStore({db: db});
  var documentStore = new DocumentStore({db: db});
  var userStore = new UserStore({db: db});

  var documentEngine = new DocumentEngine({
    changeStore: changeStore,
    documentStore: documentStore,
    schemas: {
      'mpro-article': {
        name: 'mpro-article',
        version: '1.0.0',
        documentFactory: newArticle
      }
    }
  });
  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        userStore = new UserStore({db: db});
        return userStore.seed();
      }).then(function() {
        documentStore = new DocumentStore({ db: db });
        return documentStore.seed();
      }).then(function() {
        changeStore = new ChangeStore({ db: db });
        return changeStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();

        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
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
          schemas: {
            'mpro-article': {
              name: 'mpro-article',
              version: '1.0.0',
              documentFactory: newArticle
            }
          }
        });
      }).then(done);
  });

  describe('Create document', function() {
    it('should create a new document', function(done) {
      var args = {
        documentId: 'new-doc',
        schemaName: 'mpro-article'
      };

      documentEngine.createDocument(args, function(err, doc) {
        should.not.exist(err);
        doc.should.be.an('object');
        assert.equal(doc.documentId, args.documentId);
        should.exist(doc.data);
        assert.equal(doc.data.schema.name, args.schemaName);
        done();
      });
    });

    it('should create a new document without documentId provided', function(done) {
      var args = {
        schemaName: 'mpro-article'
      };

      documentEngine.createDocument(args, function(err, doc) {
        should.not.exist(err);
        doc.should.be.an('object');
        should.exist(doc.data);
        should.exist(doc.documentId);
        done();
      });
    });
  });

  describe('Create change', function() {
    it('should not allow adding a change to non existing document', function(done) {
      var args = {
        documentId: 'some-non-existent-doc',
        change: {'some': 'change'}
      };

      documentEngine.addChange(args, function(err, version) {
        should.exist(err);
        should.not.exist(version);
        done();
      });
    });

    it('should add a new change to existing document', function(done) {
      var args = {
        documentId: '1',
        change: {'some': 'change'}
      };

      documentEngine.addChange(args, function(err, version) {
        should.not.exist(err);
        should.exist(version);
        version.should.be.a('number');
        assert.equal(version, 5);

        var args = {
          documentId: '1',
          sinceVersion: 0
        };

        documentEngine.getChanges(args, function(err, result) {
          assert.equal(result.changes.length, 5);
          assert.equal(result.version, 5);

          documentEngine.documentStore.getDocument('1', function(err, doc) {
            assert.equal(doc.version, 5);
            done();
          });
        });
      });
    });
  });

  describe('Read document', function() {
    var documentId = '1';

    it('document should be valid', function(done) {
      documentEngine.getDocument({documentId: documentId}, function(err, doc) {
        should.not.exist(err);
        doc.should.be.an('object');
        should.exist(doc.data);
        should.exist(doc.documentId);
        assert.equal(doc.version, 4);
        done();
      });
    });

    it('should return right version', function(done) {
      documentEngine.getVersion('1', function(err, version) {
        should.not.exist(err);
        should.exist(version);
        version.should.be.a('number');
        assert.equal(version, 4);
        done();
      });
    });
  });

  describe('Read changes', function() {
    var documentId = '1';

    it('changes should be valid', function(done) {
      var args = {
        documentId: '1',
        sinceVersion: 0
      };

      documentEngine.getChanges(args, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('object');
        assert.equal(result.changes.length, 4);
        assert.equal(result.version, 4);
        done();
      });
    });
  });

  describe('Remove document', function() {
    it('should remove a document', function(done) {
      var documentId = '1';
      
      documentEngine.deleteDocument(documentId, function(err, doc) {  
        should.not.exist(err);
        doc.should.be.an('object');
        assert.equal(doc.documentId, documentId);

        documentEngine.getDocument({documentId: documentId}, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);

          // Test if there are still changes for that doc after deletion
          var args = {
            documentId: documentId,
            sinceVersion: 0
          };
          documentEngine.getChanges(args, function(err) {
            should.exist(err);

            documentEngine.changeStore.getChanges(args, function(err, result) {
              assert.equal(result.changes.length, 0, 'Should be no changes');
              assert.equal(result.version, 0);
              done();
            });
          });
        });
      });
    });
  });
});


// QUnit.test('Add a change to an existing doc', function(assert) {
//   var done = assert.async();
//   documentEngine.addChange({
//     documentId: 'test-doc',
//     change: {'some': 'change'}
//   }, function(err, version) {
//     assert.notOk(err, 'Should not error');
//     assert.equal(version, 2, 'Version should have been incremented by 1');
//     var args = {
//       documentId: 'test-doc',
//       sinceVersion: 0
//     };
//     documentEngine.getChanges(args, function(err, result) {
//       assert.equal(result.changes.length, 2, 'There should be two changes in the db');
//       assert.equal(result.version, 2, 'New version should be 2');

//       documentEngine.documentStore.getDocument('test-doc', function(err, doc) {
//         assert.equal(doc.version, 2, 'Version of document record should be 2');
//         done();
//       });
//     });
//   });
// });