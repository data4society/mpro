let Configurator = require('substance').Configurator
let each = require('lodash/each')

class ServerConfigurator extends Configurator {
  constructor(...args) {
    super(...args)

    // Extend config
    this.config.stores = {}
    this.config.engines = {}
  }

  /*
    Set app config
  */
  setAppConfig(config) {
    this.config.app = config
  }

  /*
    Get app config
  */
  getAppConfig() {
    return this.config.app
  }

  setServerApp(app) {
    this.config.server = app
  }

  getServerApp() {
    return this.config.server
  }

  setWebSocketServer(wss) {
    this.config.wss = wss
  }

  getWebSocketServer() {
    return this.config.wss
  }

  /*
    Set database connection
  */
  setDBConnection(db) {
    this.config.db = db
  }

  /*
    Get database connection
  */
  getDBConnection() {
    return this.config.db.connection;
  }

  /*
    Provision of sub configurators (for different schemas)
  */
  addConfigurator(name, configurator) {
    if (!this.config.configurators) {
      this.config.configurators = {}
    }
    this.config.configurators[name] = configurator
  }

  /*
    Get sub confgiurator
  */
  getConfigurator(name) {
    if (!this.config.configurators) {
      return undefined
    }
    return this.config.configurators[name]
  }

  getSchemas() {
    let schemas = {}

    each(this.config.configurators, function(configurator) {
      let schema = configurator.getSchema()
      let seed = configurator.getSeed()
      schema.createDocument = configurator.createArticle.bind(configurator, seed)
      schemas[schema.name] = schema
    })

    return schemas
  }

  /*
    Add store
  */
  addStore(name, StoreClass) {
    this.config.stores[name] = StoreClass
  }

  /*
    Get store
  */
  getStore(name) {
    let db = this.getDBConnection();
    let StoreClass = this.config.stores[name]
    return new StoreClass({db: db})
  }

  /*
    Add engine
  */
  addEngine(name, engineInstance) {
    this.config.engines[name] = engineInstance
  }

  /*
    Get engine
  */
  getEngine(name) {
    return this.config.engines[name]
  }
}

module.exports = ServerConfigurator
