//let OpenCorpora = require('./importers/OpenCorpora')

/*
  Implements the Import Engine API.
*/
class ImportEngine {
  constructor(config) {
    this.config = config
    this.uploadPath = config.uploadPath
    this.sourceStore = config.sourceStore
    this.entityStore = config.entityStore
    this.classStore = config.classStore
    this.markupStore = config.markupStore
    this.referenceStore = config.referenceStore

    //this.openCorpora = new OpenCorpora(config)
  }

  /*
    Import data from Open Corpora
  */
  // openCorporaImporter(file, classes) {
  //   return this.openCorpora.import(file, classes)
  // }
}

module.exports = ImportEngine
