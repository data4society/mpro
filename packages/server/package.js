let config = require('config')
let extend = require('lodash/extend')
let ServerConfig = extend({}, config.get('server'), {env: config.util.getEnv('NODE_ENV')})

let Database = require('../common/Database')
let EnginePackage = require('../engine/package')
let AuthServer = require('./AuthServer')
let CollabServer = require('./CollabServer')
let DocumentServer = require('./MproDocumentServer')
let FileServer = require('./FileServer')
let MproServer = require('./MproServer')
let UserServer = require('./UserServer')
let CJSPackage = require('./cjs/package')

let db = new Database()

module.exports = {
  name: 'mpro-server',
  configure: function(config) {
    config.setAppConfig(ServerConfig)
    config.setDBConnection(db)

    config.import(CJSPackage)
    config.import(EnginePackage)

    let server = config.getServerApp()
    let socketServer = config.getWebSocketServer()

    let authEngine = config.getEngine('auth')
    let documentEngine = config.getEngine('document')
    let importEngine = config.getEngine('import')
    let mproEngine = config.getEngine('mpro')
    let sourceEngine = config.getEngine('source')

    let documentStore = config.getStore('document')
    let fileStore = config.getStore('file')

    let authServer = new AuthServer({
      authEngine: authEngine,
      path: '/api/auth'
    })

    let collabServer = new CollabServer({
      // every 30s a heart beat message is sent to keep
      // websocket connects alive when they are inactive
      heartbeat: 30000,
      authEngine: authEngine,
      documentEngine: documentEngine,
      documentStore: documentStore
    })

    let documentServer = new DocumentServer({
      documentEngine: documentEngine,
      path: '/api/documents'
    })

    let fileServer = new FileServer({
      store: fileStore,
      path: '/api/files'
    })

    let userServer = new UserServer({
      authEngine: authEngine,
      engine: mproEngine,
      path: '/api/users'
    })

    let mproServer = new MproServer({
      mproEngine: mproEngine,
      importEngine: importEngine,
      sourceEngine: sourceEngine,
      path: '/api'
    })

    authServer.bind(server)
    collabServer.bind(socketServer)
    documentServer.bind(server)
    fileServer.bind(server)
    userServer.bind(server)
    mproServer.bind(server)
  }
}