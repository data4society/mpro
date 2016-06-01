var ChangeStore = require('./server/ChangeStore');
var DocumentStore = require('./server/DocumentStore');
var EntityStore = require('./server/EntityStore');
var SessionStore = require('./server/SessionStore');
var RubricStore = require('./server/RubricStore');
var UserStore = require('./server/UserStore');
var Database = require('./server/Database');
var db = new Database();

db.reset() // Clear the database, set up the schema
  .then(function() {
    var userStore = new UserStore({ db: db });
    return userStore.seed();
  }).then(function() {
    var sessionStore = new SessionStore({ db: db });
    return sessionStore.seed();
  }).then(function() {
    var entityStore = new EntityStore({ db: db });
    return entityStore.seed();
  }).then(function() {
    var thematicStore = new RubricStore({ db: db });
    return thematicStore.seed();
  }).then(function() {
  var documentStore = new DocumentStore({ db: db });
    return documentStore.seed();
  }).then(function() {
  var changeStore = new ChangeStore({ db: db });
    return changeStore.seed();
  }).then(function() {
    console.log('Done seeding.');
    db.connection.end();
  });