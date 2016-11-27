let path = require('path')
let StorePackage = require('../store/package')
let AuthEngine = require('./AuthEngine')
let DocumentEngine = require('./MproDocumentEngine')
let ImportEngine = require('./ImportEngine')
let MproEngine = require('./MproEngine')
let SnapshotEngine = require('./MproSnapshotEngine')
let SourceEngine = require('./SourceEngine')
let PublicEngine = require('./PublicEngine')
let MailerEngine = require('./MailerEngine')

module.exports = {
  name: 'mpro-engine',
  configure: function(config) {
    config.import(StorePackage)

    let mailer = new MailerEngine({})

    let authEngine = new AuthEngine({
      mailer: mailer,
      userStore: config.getStore('user'),
      sessionStore: config.getStore('session')
    })

    let db = config.getDBConnection()
    //let schemas = config.getSchemas()

    let snapshotEngine = new SnapshotEngine({
      db: db,
      configurator: config,
      changeStore: config.getStore('change'),
      documentStore: config.getStore('document'),
      snapshotStore: config.getStore('snapshot')
    });

    let documentEngine = new DocumentEngine({
      db: db,
      configurator: config,
      changeStore: config.getStore('change'),
      documentStore: config.getStore('document'),
      snapshotEngine: snapshotEngine
    })

    let importEngine = new ImportEngine({
      uploadPath: path.join(__dirname, 'uploads'),
      entityStore: config.getStore('entity'),
      markupStore: config.getStore('markup'),
      referenceStore: config.getStore('reference'),
      sourceStore: config.getStore('source')
    })

    let mproEngine = new MproEngine({
      db: db,
      collectionStore: config.getStore('collection'),
      entityStore: config.getStore('entity'),
      rubricStore: config.getStore('rubric'),
      ruleStore: config.getStore('rule'),
      classStore: config.getStore('class'),
      userStore: config.getStore('user')
    })

    let sourceEngine = new SourceEngine({
      configurator: config,
      engine: mproEngine,
      documentStore: config.getStore('document'),
      ruleStore: config.getStore('rule'),
      sourceStore: config.getStore('source')
    })

    let publicEngine = new PublicEngine({
      db: db,
      apiStore: config.getStore('api'),
      documentStore: config.getStore('document')
    })
    
    config.addEngine('auth', authEngine)
    config.addEngine('snapshot', snapshotEngine)
    config.addEngine('document', documentEngine)
    config.addEngine('import', importEngine)
    config.addEngine('mailer', mailer)
    config.addEngine('mpro', mproEngine)
    config.addEngine('source', sourceEngine)
    config.addEngine('public', publicEngine)
  }
}
