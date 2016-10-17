let path = require('path')
let StorePackage = require('../store/package')
let AuthEngine = require('./AuthEngine')
let DocumentEngine = require('./MproDocumentEngine')
let ImportEngine = require('./ImportEngine')
let MproEngine = require('./MproEngine')
let SnapshotEngine = require('./MproSnapshotEngine')
let SourceEngine = require('./SourceEngine')
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
    let schemas = config.getSchemas()

    let snapshotEngine = new SnapshotEngine({
      db: db,
      changeStore: config.getStore('change'),
      documentStore: config.getStore('document'),
      snapshotStore: config.getStore('snapshot'),
      schemas: schemas
    });

    let documentEngine = new DocumentEngine({
      db: db,
      changeStore: config.getStore('change'),
      documentStore: config.getStore('document'),
      snapshotEngine: snapshotEngine,
      schemas: schemas
    })

    let importEngine = new ImportEngine({
      uploadPath: path.join(__dirname, 'uploads'),
      entityStore: config.getStore('entity'),
      markupStore: config.getStore('markup'),
      referenceStore: config.getStore('reference'),
      sourceStore: config.getStore('source')
    })

    let mproEngine = new MproEngine({
      entityStore: config.getStore('entity'),
      rubricStore: config.getStore('rubric'),
      classStore: config.getStore('class')
    })

    let sourceEngine = new SourceEngine({
      documentStore: config.getStore('document'),
      sourceStore: config.getStore('entity')
    })
    
    config.addEngine('auth', authEngine)
    config.addEngine('snapshot', snapshotEngine)
    config.addEngine('document', documentEngine)
    config.addEngine('import', importEngine)
    config.addEngine('mailer', mailer)
    config.addEngine('mpro', mproEngine)
    config.addEngine('source', sourceEngine)
  }
}
