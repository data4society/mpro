var assert = require('chai').assert;
var should = require('chai').should();

var Database = require('../../server/Database');
var SessionStore = require('../../server/SessionStore');
var UserStore = require('../../server/UserStore');

describe('Entity Store', function() {
  var db = new Database();

  var sessionStore = new SessionStore({db: db});
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
        var sessionStore = new SessionStore({ db: db });
        return sessionStore.seed();
      }).then(function(){
        db.connection.end();
        db = new Database();
        sessionStore = new SessionStore({db: db});
        
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
        var sessionStore = new SessionStore({ db: db });
        return sessionStore.seed();
      }).then(done);
  });

  describe('Create session', function() {
    it('should return new session for a given user', function(done) {
      var sessionData = {
        owner: 'testuser'
      };
      return sessionStore.createSession(sessionData)
        .then(function(session) {
          session.should.be.an('object');
          should.exist(session.session_token);
          should.exist(session.created);
          assert.equal(session.owner, sessionData.owner);
          done();
        });
    });

    it('should create new session from old one', function(done) {
      var session_token = 'testusertoken';
      var existingSession;

      return sessionStore.getSession(session_token)
        .then(function(sessionData) {
          existingSession = sessionData;
          return sessionStore.createSession(sessionData);
        })
        .then(function(session) {
          session.should.be.an('object');
          should.exist(session.session_token);
          should.exist(session.created);
          assert.equal(session.owner, existingSession.owner);
          done();
        });
    });
  });

  describe('Get session', function() {
    it('should return session record with given token', function(done) {
      var sessionToken = 'testusertoken';
      return sessionStore.getSession(sessionToken)
        .then(function(session) {
          session.should.be.an('object');
          assert.equal(session.session_token, sessionToken);
          done();
        });
    });

    it('should return error if session with given token does not exist', function(done) {
      var sessionToken = 'non-existing-token';
      return sessionStore.getSession(sessionToken)
        .then(function(session) {
          should.not.exist(session);
        }).catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No session found for session_token ' + sessionToken);
          done();
        });
    });
  });

  describe('Delete session', function() {
    it('should delete session and return deleted record for a last time', function(done) {
      var sessionToken = 'testusertoken';

      return sessionStore.deleteSession(sessionToken)
        .then(function(session) {
          should.exist(session);
          session.should.be.an('object');
          assert.equal(session.session_token, sessionToken);
          return sessionStore.getSession(sessionToken);
        })
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'No session found for session_token ' + sessionToken);
          done();
        });
    });

    it('should return error in case of non-existing record', function(done) {
      var sessionToken = 'non-existing-session';

      return sessionStore.deleteSession(sessionToken)
        .catch(function(err) {
          should.exist(err);
          assert.equal(err.message, 'Session with session_token ' + sessionToken + ' does not exists');
          done();
        });
    });
  });

  describe('Entity existance', function() {
    it('should return true in case of existed record', function(done) {
      var sessionToken = 'testusertoken';

      return sessionStore.sessionExists(sessionToken)
        .then(function(exist) {
          assert.equal(exist, true);
          done();
        });
    });

    it('should return false in case of non-existed record', function(done) {
      var sessionToken = 'non-existing-session';

      return sessionStore.sessionExists(sessionToken)
        .then(function(exist) {
          assert.equal(exist, false);
          done();
        });
    });
  });
});