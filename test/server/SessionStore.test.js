'use strict';

var substanceTest = require('substance/test/test').module('server/SessionStore');

var Database = require('../../server/Database');
var SessionStore = require('../../server/SessionStore');
var UserStore = require('../../server/UserStore');

var db, sessionStore, userStore;

function setup() {
  db = new Database();
  return db.reset()
    .then(function() {
      userStore = new UserStore({db: db});
      return userStore.seed();
    })
    .then(function() {
      sessionStore = new SessionStore({ db: db });
      return sessionStore.seed();
    }).then(function(){
      // we have to shutdown db connection and establish test again one time
      // so massive will have all methods attached to test's DB object
      // if we will not do test massive will not have methods atatched to table
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
  Create session
*/

test('Should return new session for a given user', function(t) {
  var sessionData = {
    owner: 'testuser'
  };
  return sessionStore.createSession(sessionData)
    .then(function(session) {
      t.isNotNil(session.session_token, 'Session token should exists');
      t.isNotNil(session.created, 'Session creation date should exists');
      t.equal(session.owner, sessionData.owner, 'Session owner should equals owner from arguments');
      t.end();
    });
});

test('Should create new session from old one', function(t) {
  var session_token = 'testusertoken';
  var existingSession;

  return sessionStore.getSession(session_token)
    .then(function(sessionData) {
      existingSession = sessionData;
      return sessionStore.createSession(sessionData);
    })
    .then(function(session) {
      t.isNotNil(session.session_token, 'Session token should exists');
      t.isNotNil(session.created, 'Session creation date should exists');
      t.equal(session.owner, existingSession.owner, 'Session owner should equals owner from existing session');
      t.end();
    });
});

/*
  Get session
*/

test('Should return session record with given token', function(t) {
  var sessionToken = 'testusertoken';
  return sessionStore.getSession(sessionToken)
    .then(function(session) {
      t.equal(session.session_token, sessionToken, 'Session token should equals sessionToken from arguments');
      t.end();
    });
});

test('Should return error if session with given token does not exist', function(t) {
  var sessionToken = 'non-existing-token';
  return sessionStore.getSession(sessionToken)
    .then(function(session) {
      t.isNil(session, 'Session should not exists');
    }).catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No session found for session_token ' + sessionToken, 'Error message should equals to given one');
      t.end();
    });
});

/*
  Delete session
*/

test('Should delete session and return deleted record for a last time', function(t) {
  var sessionToken = 'testusertoken';

  return sessionStore.deleteSession(sessionToken)
    .then(function(session) {
      t.isNotNil(session, 'Session should exists');
      t.equal(session.session_token, sessionToken, 'Session token should equals sessionToken from arguments');
      return sessionStore.getSession(sessionToken);
    })
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'No session found for session_token ' + sessionToken, 'Error message should equals to given one');
      t.end();
    });
});

test('Should return error in case of non-existing record', function(t) {
  var sessionToken = 'non-existing-session';

  return sessionStore.deleteSession(sessionToken)
    .catch(function(err) {
      t.isNotNil(err, 'Should error');
      t.equal(err.message, 'Session with session_token ' + sessionToken + ' does not exists', 'Error message should equals to given one');
      t.end();
    });
});

/*
  Session existance
*/

test('Should return true in case of existed record', function(t) {
  var sessionToken = 'testusertoken';

  return sessionStore.sessionExists(sessionToken)
    .then(function(exist) {
      t.equal(exist, true, 'Session should exists');
      t.end();
    });
});

test('Should return false in case of non-existed record', function(t) {
  var sessionToken = 'non-existing-session';

  return sessionStore.sessionExists(sessionToken)
    .then(function(exist) {
      t.equal(exist, false, 'Session should not exists');
      t.end();
    });
});