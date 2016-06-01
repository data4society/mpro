var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var SourceStore = require('../../server/SourceStore');

describe('Source Store', function() {
  var db = new Database();

  var sourceStore = new SourceStore({db: db});

  // we have to shutdown db connection and establish it again one time
  // so massive will have all methods attached to it's DB object
  // if we will not do it massive will not have methods atatched to table
  // because there was no tables when we started first unit test
  before(function(done) {
    db.reset()
      .then(function() {
        var sourceStore = new SourceStore({ db: db });
        return sourceStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        sourceStore = new SourceStore({db: db});
        
        done();
      });
  });

  beforeEach(function(done) {
    db.reset()
      .then(function() {
        var sourceStore = new SourceStore({ db: db });
        return sourceStore.seed();
      }).then(done);
  });

  describe('Create source document', function() {
    it('should return new document source record with given data', function(done) {
      var sourceData = {
        title: 'Test'
      };
      return sourceStore.createSource(sourceData)
        .then(function(source) {
          source.should.be.an('object');
          should.exist(source.doc_id);
          assert.equal(source.title, sourceData.title);
          done();
        });
    });

    it('should return new document source record with given id', function(done) {
      var sourceData = {
        doc_id: "non-existing-rubric"
      };
      return sourceStore.createSource(sourceData)
        .then(function(source) {
          source.should.be.an('object');
          should.exist(source.doc_id);
          assert.equal(source.doc_id, sourceData.doc_id);
          done();
        });
    });

    it('should return error if document source with given doc_id already exist', function(done) {
      var sourceData = {
        doc_id: '68c14a78-d02b-454d-88ce-6948d27fce09'
      };
      return sourceStore.createSource(sourceData)
        .then(function(source) {
          should.not.exist(source);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Document source ' + sourceData.doc_id + ' already exists.');
          done();
        });
    });
  });

  describe('Get document source', function() {
    it('should return document source record with given id', function(done) {
      var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';
      return sourceStore.getSource(sourceId)
        .then(function(source) {
          source.should.be.an('object');
          assert.equal(source.doc_id, sourceId);
          done();
        });
    });

    it('should return error if document source with given id does not exist', function(done) {
      var sourceId = 'non-existing-document-source';
      return sourceStore.getSource(sourceId)
        .then(function(source) {
          should.not.exist(source);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No document source found for doc_id ' + sourceId);
          done();
        });
    });
  });

  describe('Update document source', function() {
    it('should update document source and return updated record', function(done) {
      var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';
      var data = {
        title: 'Test document'
      };

      return sourceStore.updateSource(sourceId, data)
        .then(function(source) {
          should.exist(source);
          source.should.be.an('object');
          assert.equal(source.doc_id, sourceId);
          assert.equal(source.title, data.title);
          return sourceStore.getSource(sourceId);
        })
        .then(function(source) {
          should.exist(source);
          source.should.be.an('object');
          assert.equal(source.doc_id, sourceId);
          assert.equal(source.title, data.title);
          done();
        });
    });
  });

  describe('Delete document source', function() {
    it('should delete document source and return deleted record for a last time', function(done) {
      var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';

      return sourceStore.deleteSource(sourceId)
        .then(function(source) {
          should.exist(source);
          source.should.be.an('object');
          assert.equal(source.doc_id, sourceId);
          return sourceStore.getSource(sourceId);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No document source found for doc_id ' + sourceId);
          done();
        });
    });

    it('should return error in case of non-existing record', function(done) {
      var sourceId = 'non-existing-document-source';

      return sourceStore.deleteSource(sourceId)
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Document source with doc_id ' + sourceId + ' does not exists');
          done();
        });
    });
  });

  describe('Document existance', function() {
    it('should return true in case of existed record', function(done) {
      var sourceId = '68c14a78-d02b-454d-88ce-6948d27fce09';

      return sourceStore.sourceExists(sourceId)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false in case of non-existed record', function(done) {
      var sourceId = 'non-existing-document-source';

      return sourceStore.sourceExists(sourceId)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });
});