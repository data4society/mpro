let Database = require('../packages/common/Database')
let Configurator = require('../packages/common/ServerConfigurator')
let EnginePackage = require('../packages/engine/package')

let fileName = process.argv[2]
let db = new Database()
let configurator = new Configurator()
configurator.setDBConnection(db)
configurator.import(EnginePackage)

let importEngine = configurator.getEngine('import')

importEngine.openCorporaDir(fileName)
  .then(function() {
    console.log('Import has been finished')
    db.shutdown()
  })
  .catch(function(err) {
    console.log(err)
    db.shutdown()
  })