let Database = require('./packages/common/Database')
let Configurator = require('./packages/common/ServerConfigurator')
let StorePackage = require('./packages/store/package')

let configurator = new Configurator().import(StorePackage)
let db = new Database()
configurator.setDBConnection(db)

db.reset() // Clear the database, set up the schema
  .then(function() {
    let userStore = configurator.getStore('user')
    return userStore.seed()
  }).then(function() {
    let sessionStore = configurator.getStore('session')
    return sessionStore.seed()
  }).then(function() {
    let classStore = configurator.getStore('class')
    return classStore.seed()
  }).then(function() {
    let entityStore = configurator.getStore('entity')
    return entityStore.seed()
  }).then(function() {
    let rubricStore = configurator.getStore('rubric')
    return rubricStore.seed()
  }).then(function() {
    let sourceStore = configurator.getStore('source')
    return sourceStore.seed()
  }).then(function() {
    let documentStore = configurator.getStore('document')
    return documentStore.seed()
  }).then(function() {
    let changeStore = configurator.getStore('change')
    return changeStore.seed()
  }).then(function() {
    let collectionStore = configurator.getStore('collection')
    return collectionStore.seed()
  }).then(function() {
    let ruleStore = configurator.getStore('rule')
    return ruleStore.seed()
  }).then(function() {
    console.log('Done seeding.') // eslint-disable-line
    db.connection.end()
  })