let testModule = require('substance-test').module

let Configurator = require('../../packages/common/ServerConfigurator')
let Database = require('../../packages/common/Database')
let StorePackage = require('../../packages/store/package')

const substanceTest = testModule('collab/SessionStore')

let configurator = new Configurator()
let sessionStore

function setup() {
  let db = new Database()
  
  return db.reset()
    .then(function() {
      db.shutdown()
      db = new Database()
      configurator.setDBConnection(db)
      configurator.import(StorePackage)
    })
    .then(function() {
      let userStore = configurator.getStore('user')
      return userStore.seed()
    })
    .then(function() {
      sessionStore = configurator.getStore('session')
      return sessionStore.seed()
    })
}

function teardown() {
  let db = configurator.getDBConnection()
  db.end()
}

function test(description, fn) {
  substanceTest(description, function (t) {
    setup().then(function(){
      t.once('end', teardown)
      fn(t)
    })
  })
}

/*
  Create session
*/

test('Should return new session for a given user', function(t) {
  let sessionData = {
    owner: 'testuser'
  }
  return sessionStore.createSession(sessionData)
    .then(function(session) {
      t.isNotNil(session.session_token, 'Session token should exists')
      t.isNotNil(session.created, 'Session creation date should exists')
      t.equal(session.owner, sessionData.owner, 'Session owner should equals owner from arguments')
      t.end()
    })
})

test('Should create new session from old one', function(t) {
  let session_token = 'testusertoken'
  let existingSession

  return sessionStore.getSession(session_token)
    .then(function(sessionData) {
      existingSession = sessionData
      return sessionStore.createSession(sessionData)
    })
    .then(function(session) {
      t.isNotNil(session.session_token, 'Session token should exists')
      t.isNotNil(session.created, 'Session creation date should exists')
      t.equal(session.owner, existingSession.owner, 'Session owner should equals owner from existing session')
      t.end()
    })
})

/*
  Get session
*/

test('Should return session record with given token', function(t) {
  let sessionToken = 'testusertoken'
  return sessionStore.getSession(sessionToken)
    .then(function(session) {
      t.equal(session.session_token, sessionToken, 'Session token should equals sessionToken from arguments')
      t.end()
    })
})

test('Should return error if session with given token does not exist', function(t) {
  let sessionToken = 'non-existing-token'
  return sessionStore.getSession(sessionToken)
    .then(function(session) {
      t.isNil(session, 'Session should not exists')
    }).catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'No session found for session_token ' + sessionToken, 'Error message should equals to given one')
      t.end()
    })
})

/*
  Delete session
*/

test('Should delete session and return deleted record for a last time', function(t) {
  let sessionToken = 'testusertoken'

  return sessionStore.deleteSession(sessionToken)
    .then(function(session) {
      t.isNotNil(session, 'Session should exists')
      t.equal(session.session_token, sessionToken, 'Session token should equals sessionToken from arguments')
      return sessionStore.getSession(sessionToken)
    })
    .catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'No session found for session_token ' + sessionToken, 'Error message should equals to given one')
      t.end()
    })
})

test('Should return error in case of non-existing record', function(t) {
  let sessionToken = 'non-existing-session'

  return sessionStore.deleteSession(sessionToken)
    .catch(function(err) {
      t.isNotNil(err, 'Should error')
      t.equal(err.message, 'Session with session_token ' + sessionToken + ' does not exists', 'Error message should equals to given one')
      t.end()
    })
})

/*
  Session existance
*/

test('Should return true in case of existed record', function(t) {
  let sessionToken = 'testusertoken'

  return sessionStore.sessionExists(sessionToken)
    .then(function(exist) {
      t.equal(exist, true, 'Session should exists')
      t.end()
    })
})

test('Should return false in case of non-existed record', function(t) {
  let sessionToken = 'non-existing-session'

  return sessionStore.sessionExists(sessionToken)
    .then(function(exist) {
      t.equal(exist, false, 'Session should not exists')
      t.end()
    })
})