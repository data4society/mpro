let ChangeStore = require('./ChangeStore')
let ClassStore = require('./ClassStore')
let CollectionStore = require('./CollectionStore')
let DocumentStore = require('./DocumentStore')
let EntityStore = require('./EntityStore')
let FileStore = require('./FileStore')
let MarkupStore = require('./MarkupStore')
let ReferenceStore = require('./ReferenceStore')
let RubricStore = require('./RubricStore')
let RuleStore = require('./RuleStore')
let SessionStore = require('./SessionStore')
let SnapshotStore = require('./SnapshotStore')
let SourceStore = require('./SourceStore')
let UserStore = require('./UserStore')

module.exports = {
  name: 'mpro-store',
  configure: function(config) {
    config.addStore('change', ChangeStore)
    config.addStore('class', ClassStore)
    config.addStore('collection', CollectionStore)
    config.addStore('document', DocumentStore)
    config.addStore('entity', EntityStore)
    config.addStore('file', FileStore)
    config.addStore('markup', MarkupStore)
    config.addStore('reference', ReferenceStore)
    config.addStore('rubric', RubricStore)
    config.addStore('rule', RuleStore)
    config.addStore('session', SessionStore)
    config.addStore('snapshot', SnapshotStore)
    config.addStore('source', SourceStore)
    config.addStore('user', UserStore)
  }
}
