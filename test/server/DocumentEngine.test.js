var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var DocumentEngine = require('../../server/DocumentEngine');
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
        
        // documentEngine = new DocumentEngine({
        //   changeStore: changeStore,
        //   documentStore: documentStore
        // });

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
      }).then(function() {
        // documentEngine = new DocumentEngine({
        //   changeStore: changeStore,
        //   documentStore: documentStore
        // });
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
        should.exist(doc.data);
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
});