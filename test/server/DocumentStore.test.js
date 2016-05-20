var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var DocumentStore = require('../../server/DocumentStore');
var UserStore = require('../../server/UserStore');

describe('Document Store', function() {
  var db = new Database();

  var documentStore = new DocumentStore({db: db});
  var userStore = new UserStore({db: db});

  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        var userStore = new UserStore({db: db});
        return userStore.seed();
      })
      .then(function() {
        var documentStore = new DocumentStore({ db: db });
        return documentStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        documentStore = new DocumentStore({db: db});
        
        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
      .then(function() {
        var userStore = new UserStore({db: db});
        return userStore.seed();
      })
      .then(function() {
        var documentStore = new DocumentStore({ db: db });
        return documentStore.seed();
      }).then(done);
  });

  describe('Create document', function() {
    it('should сreate and return a new document', function(done) {
      var newDoc = {
        documentId: 'new-doc',
        title: 'test document',
        schema_version: '1.0.0',
        info: {
          custom: 'some custom data',
          schemaName: 'mpro-article',
        }
      };

      documentStore.createDocument(newDoc, function(err, doc) {
        should.not.exist(err);
        should.exist(doc);
        doc.should.be.an('object');
        should.exist(doc.documentId);
        assert.equal(doc.documentId, newDoc.document_id);
        assert.equal(doc.title, newDoc.title);
        assert.equal(doc.schema_name, newDoc.info.schemaName);
        assert.equal(doc.schema_version, newDoc.schema_version);
        assert.equal(doc.version, 1);
        assert.deepEqual(doc.info, newDoc.info);
        done();
      });
    });

    it('should create and return a new document without providing a documentId', function(done) {
      var newDoc = {
        title: 'test document',
        schema_name: 'mpro-article',
        schema_version: '1.0.0',
        info: {
          custom: 'some custom data'
        }
      };

      documentStore.createDocument(newDoc, function(err, doc) {
        should.not.exist(err);
        should.exist(doc);
        doc.should.be.an('object');
        should.exist(doc.documentId);
        done();
      });
    });

    it('should not allow to create a new document with already existing id', function(done) {
      var newDoc = {
        documentId: '1',
        title: 'test document',
        schema_name: 'mpro-article',
        schema_version: '1.0.0',
        info: {
          custom: 'some custom data'
        }
      };

      documentStore.createDocument(newDoc, function(err, doc) {
        should.exist(err);
        should.not.exist(doc);
        assert.equal(err.message, 'Document ' + newDoc.documentId + ' already exists.');
        done();
      });
    });
  });

  describe('Get document', function() {
    it('should return document record with given id', function(done) {
      var documentId = '1';

      documentStore.getDocument(documentId, function(err, doc) {
        should.not.exist(err);
        should.exist(doc);
        doc.should.be.an('object');
        assert.equal(doc.document_id, documentId);
        done();
      });
    });

    it('should return error if document with given id does not exist', function(done) {
      var documentId = 'non-existing-doc';

      documentStore.getDocument(documentId, function(err, doc) {
        should.exist(err);
        should.not.exist(doc);
        assert.equal(err.message, 'No document found for documentId ' + documentId);
        done();
      });
    });
  });

  describe('Update document', function() {
    it('should update document and return updated record', function(done) {
      var documentId = '1';
      var data = {
        schema_name: 'mpro-blog',
        schema_version: '2.0.0',
        info: {
          title: 'new title'
        }
      };

      documentStore.updateDocument(documentId, data, function(err, doc) {
        should.not.exist(err);
        should.exist(doc);
        doc.should.be.an('object');
        assert.equal(doc.document_id, documentId);
        assert.equal(doc.title, data.info.title);
        assert.equal(doc.schema_name, data.schema_name);
        assert.equal(doc.schema_version, data.schema_version);
        assert.deepEqual(doc.info, data.info);
        done();
      });
    });

    it('should return error if document with given id does not exist', function(done) {
      var documentId = 'non-existing-doc';
      var data = {
        schema_name: 'mpro-blog',
        schema_version: '2.0.0',
        info: {
          title: 'new title'
        }
      };

      documentStore.updateDocument(documentId, data, function(err, doc) {
        should.exist(err);
        should.not.exist(doc);
        assert.equal(err.message, 'Document with documentId ' + documentId + ' does not exists');
        done();
      });
    });
  });

  describe('Delete document', function() {
    it('should delete entity and return deleted record for a last time', function(done) {
      var documentId = '1';

      documentStore.deleteDocument(documentId, function(err, doc) {
        should.not.exist(err);
        should.exist(doc);
        doc.should.be.an('object');
        assert.equal(doc.document_id, documentId);

        documentStore.getDocument(documentId, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          assert.equal(err.message, 'No document found for documentId ' + documentId);
          done();
        });
      });
    });

    it('should return error if document with given id does not exist', function(done) {
      var documentId = 'non-existing-doc';

      documentStore.deleteDocument(documentId, function(err, doc) {
        should.exist(err);
        should.not.exist(doc);
        assert.equal(err.message, 'Document with documentId ' + documentId + ' does not exists');
        done();
      });
    });
  });

  describe('Document existance', function() {
    it('should return true if document is existing', function(done) {
      var documentId = '1';

      documentStore.documentExists(documentId, function(err, exist) {
        should.not.exist(err);
        should.exist(exist);
        exist.should.be.a('boolean');
        assert.equal(exist, true);
        done();
      });
    });

    it('should return false if document is not existing ', function(done) {
      var documentId = 'non-existing-doc';

      documentStore.documentExists(documentId, function(err, exist) {
        should.not.exist(err);
        should.exist(exist);
        exist.should.be.a('boolean');
        assert.equal(exist, false);
        done();
      });
    });
  });

  describe('Document listing', function() {
    it('should return list of documents', function(done) {
      documentStore.listDocuments({}, {}, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.be.an('object');
        results.records.should.be.an('array');
        assert.equal(results.total, 3);
        assert.equal(results.records[0].schema_name, 'mpro-article');
        assert.equal(results.records[0].schema_version, '1.0.0');
        done();
      });
    });

    it('should return list of documents with matching filters', function(done) {
      var filters = {
        validated_by: 'testuser2'
      }; 

      documentStore.listDocuments(filters, {}, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.be.an('object');
        results.records.should.be.an('array');
        assert.equal(results.total, 2);
        assert.equal(results.records[0].validated_by, filters.validated_by);
        done();
      });
    });

    it('should return list of documents with applied options', function(done) {
      var filters = {
        validated_by: 'testuser2'
      };

      var options = {
        limit: 1
      };

      documentStore.listDocuments(filters, options, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.be.an('object');
        results.records.should.be.an('array');
        assert.equal(results.total, 2);
        assert.equal(results.records.length, 1);
        assert.equal(results.records[0].validated_by, filters.validated_by);
        done();
      });
    });

    it('should return empty list of documents with filters that does not match', function(done) {
      var filters = {
        validated_by: 'non-existing-user'
      };

      documentStore.listDocuments(filters, {}, function(err, results) {
        should.not.exist(err);
        should.exist(results);
        results.should.be.an('object');
        results.records.should.be.an('array');
        assert.equal(results.total, 0);
        assert.equal(results.records.length, 0);
        done();
      });
    });
  });
});