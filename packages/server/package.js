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

// We will impor CommonJS versions of schemas as node.js 
// still not support ES2015 import and export statements
// TODO: switch back after node.js v7 release
let SubConfigurator = require('../common/ServerConfigurator')
let ArticlePackage = require('./schemas/article/package')
let ArticleImporter = require('./schemas/article/ArticleImporter')
let TngPackage = require('./schemas/tng/package')
let TngImporter = require('./schemas/tng/TngImporter')
let VkPackage = require('./schemas/vk/package')
let VkImporter = require('./schemas/vk/VkImporter')

let articleConfigurator = new SubConfigurator().import(ArticlePackage)
articleConfigurator.addImporter('html', ArticleImporter)

let tngConfigurator = new SubConfigurator().import(TngPackage)
tngConfigurator.addImporter('html', TngImporter)

let vkConfigurator = new SubConfigurator().import(VkPackage)
vkConfigurator.addImporter('html', VkImporter)

let db = new Database()

module.exports = {
  name: 'mpro-server',
  configure: function(config) {
    config.import(EnginePackage)

    config.setAppConfig(ServerConfig)
    config.setDBConnection(db)

    config.addConfigurator('mpro-article', articleConfigurator)
    config.addConfigurator('mpro-tng', tngConfigurator)
    config.addConfigurator('mpro-vk', vkConfigurator)

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
    mproServer.bind(server)
  }
}