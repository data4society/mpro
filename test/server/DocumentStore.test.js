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
        document_id: 'new-doc',
        title: 'test document',
        schema_name: 'mpro-article',
        schema_version: '1.0.0',
        info: {
          custom: 'some custom data'
        }
      };

      return documentStore.createDocument(newDoc)
        .then(function(doc) {
          doc.should.be.an('object');
          should.exist(doc.document_id);
          assert.equal(doc.document_id, newDoc.document_id);
          assert.equal(doc.title, newDoc.title);
          assert.equal(doc.schema_name, newDoc.schema_name);
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

      return documentStore.createDocument(newDoc)
        .then(function(doc) {
          doc.should.be.an('object');
          should.exist(doc.document_id);
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

      return documentStore.createDocument(newDoc)
        .then(function(doc) {
          should.not.exist(doc);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Document ' + newDoc.document_id + ' already exists.');
          done();
        });
    });
  });

  describe('Get document', function() {
    it('should return document record with given id', function(done) {
      var documentId = '1';
      
      return documentStore.getDocument(documentId)
        .then(function(doc) {
          doc.should.be.an('object');
          assert.equal(doc.document_id, documentId);
          done();
        });
    });

    it('should return error if document with given id does not exist', function(done) {
      var documentId = 'non-existing-doc';

      return documentStore.getDocument(documentId)
        .then(function(doc) {
          should.not.exist(doc);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No document found for document_id ' + documentId);
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

      return documentStore.updateDocument(documentId, data)
        .then(function(doc) {
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

      return documentStore.updateDocument(documentId, data)
        .then(function(doc) {
          should.not.exist(doc);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Document with document_id ' + documentId + ' does not exists');
          done();
        });
    });
  });

  describe('Delete document', function() {
    it('should delete entity and return deleted record for a last time', function(done) {
      var documentId = '1';
      
      return documentStore.deleteDocument(documentId)
        .then(function(doc) {
          doc.should.be.an('object');
          assert.equal(doc.document_id, documentId);
          return documentStore.getDocument(documentId);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No document found for document_id ' + documentId);
          done();
        });
    });

    it('should return error if document with given id does not exist', function(done) {
      var documentId = 'non-existing-doc';

      return documentStore.deleteDocument(documentId)
        .then(function(doc) {
          should.not.exist(doc);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Document with document_id ' + documentId + ' does not exists');
          done();
        });
    });
  });

  describe('Document existance', function() {
    it('should return true if document is existing', function(done) {
      var documentId = '1';

      return documentStore.documentExists(documentId)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false if document is not existing ', function(done) {
      var documentId = 'non-existing-doc';

      return documentStore.documentExists(documentId)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });

  describe('Document listing', function() {
    it('should return list of documents', function(done) {
      return documentStore.listDocuments({},{})
        .then(function(results) {
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

      return documentStore.listDocuments(filters, {})
        .then(function(results) {
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

      return documentStore.listDocuments(filters, options)
        .then(function(results) {
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

      return documentStore.listDocuments(filters, {})
        .then(function(results) {
          results.should.be.an('object');
          results.records.should.be.an('array');
          assert.equal(results.total, 0);
          assert.equal(results.records.length, 0);
          done();
        });
    });
  });
});