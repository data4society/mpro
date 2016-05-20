var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var ChangeStore = require('../../server/ChangeStore');
var DocumentStore = require('../../server/DocumentStore');
var UserStore = require('../../server/UserStore');

describe('Change Store', function() {
  var db = new Database();

  var changeStore = new ChangeStore({db: db});
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
      }).then(function() {
        var documentStore = new DocumentStore({ db: db });
        return documentStore.seed();
      }).then(function() {
        var changeStore = new ChangeStore({ db: db });
        return changeStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        changeStore = new ChangeStore({db: db});
        
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
      })
      .then(function() {
        var changeStore = new ChangeStore({ db: db });
        return changeStore.seed();
      }).then(done);
  });

  describe('Add changes', function() {
    it('Add a new change to document', function(done) {
      var args = {
        documentId: '2',
        change: {
          ops: [{some: 'operation'}],
          // the info object is meant to store any custom information
          info: {
            userId: 'testuser'
          }
        }
      };

      changeStore.addChange(args, function(err, version) {
        should.not.exist(err);
        should.exist(version);
        version.should.be.an('number');
        assert.equal(version, 1);

        changeStore.getChanges({
          documentId: '2',
          sinceVersion: 0
        }, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.be.an('object');
          assert.equal(result.changes.length, 1);
          assert.equal(result.version, 1);
          //TODO: test info object values
          //assert.equal(result.changes[1].info.owner, 'testuser');
          done();
        });
      });
    });

    it('should only create changes associated with a documentId', function(done) {
      var args = {
        change: {
          ops: [{some: 'operation'}],
          // the info object is meant to store any custom information
          info: {
            userId: 'testuser'
          }
        }
      };

      changeStore.addChange(args, function(err, version) {
        should.exist(err);
        should.not.exist(version);
        assert.equal(err.name, 'ChangeStore.CreateError');
        done();
      });
    });
  });

  describe('Read changes', function() {
    it('should return changes of a document', function(done) {
      var args = {
        documentId: '1',
        sinceVersion: 0
      };

      changeStore.getChanges(args, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('object');
        assert.equal(result.changes.length, 4);
        assert.equal(result.version, 4);
        done();
      });
    });

    it('should return all changes of a document by not specifying sinceVersion', function(done) {
      var args = {
        documentId: '1'
      };

      changeStore.getChanges(args, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('object');
        assert.equal(result.changes.length, 4);
        assert.equal(result.version, 4);
        done();
      });
    });

    it('should return no changes if sinceVersion equals actual version', function(done) {
      var args = {
        documentId: '1',
        sinceVersion: 4
      };

      changeStore.getChanges(args, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('object');
        assert.equal(result.changes.length, 0);
        assert.equal(result.version, 4);
        done();
      });
    });

    it('should return changes of a document between version 1 and version 2', function(done) {
      var args = {
        documentId: '1',
        sinceVersion: 1,
        toVersion: 2
      };

      changeStore.getChanges(args, function(err, result) {
        should.not.exist(err);
        should.exist(result);
        result.should.be.an('object');
        assert.equal(result.changes.length, 1);
        assert.equal(result.version, 4);
        done();
      });
    });

    it('should return error in case of invalid use of getChanges sinceVersion argument', function(done) {
      var args = {
        documentId: '1',
        sinceVersion: -5
      };

      changeStore.getChanges(args, function(err, result) {
        should.exist(err);
        should.not.exist(result);
        assert.equal(err.name, 'ChangeStore.ReadError');
        done();
      });
    });

    it('should return error in case of invalid use of getChanges toVersion argument', function(done) {
      var args = {
        documentId: '1',
        toVersion: -3
      };

      changeStore.getChanges(args, function(err, result) {
        should.exist(err);
        should.not.exist(result);
        assert.equal(err.name, 'ChangeStore.ReadError');
        done();
      });
    });

    it('should return error in case of invalid use of getChanges version arguments', function(done) {
      var args = {
        documentId: '1',
        sinceVersion: 2,
        toVersion: 1
      };

      changeStore.getChanges(args, function(err, result) {
        should.exist(err);
        should.not.exist(result);
        assert.equal(err.name, 'ChangeStore.ReadError');
        done();
      });
    });
  });

  describe('Get version', function() {
    it('should return version of a document', function(done) {
      var documentId = 1;

      changeStore.getVersion(documentId, function(err, version) {
        should.not.exist(err);
        should.exist(version);
        version.should.be.an('number');
        assert.equal(version, 4);
        done();
      });
    });

    it('should return version 0 if no changes are found', function(done) {
      var documentId = 'non-existing-doc';

      changeStore.getVersion(documentId, function(err, version) {
        should.not.exist(err);
        should.exist(version);
        version.should.be.an('number');
        assert.equal(version, 0);
        done();
      });
    });
  });

  describe('Delete changes', function() {
    it('should delete all changes of a document', function(done) {
      var documentId = 1;

      changeStore.deleteChanges(documentId, function(err, count) {
        should.not.exist(err);
        should.exist(count);
        count.should.be.an('number');
        assert.equal(count, 4);

        changeStore.getChanges({
          documentId: documentId,
          sinceVersion: 0
        }, function(err, result) {
          should.not.exist(err);
          should.exist(result);
          result.should.be.an('object');
          assert.equal(result.changes.length, 0);
          assert.equal(result.version, 0);
          done();
        });
      });
    });

    it('counter of deleted changes should equals 0 if no changes are found', function(done) {
      var documentId = 'non-existing-doc';

      changeStore.deleteChanges(documentId, function(err, count) {
        should.not.exist(err);
        should.exist(count);
        count.should.be.an('number');
        assert.equal(count, 0);
        done();
      });
    });
  });
});