import EntityEditorPackage from '../entity-editor/package'
import Entities from './Entities'
import Resources from './Resources'

export default {
  name: 'resources',
  configure: function(config) {
    config.import(EntityEditorPackage)
    config.addPage('entities', Entities)
    config.addPage('resources', Resources)

    config.addLabel('configurator-resources', {
      en: 'Resources',
      ru: 'Сущности'
    })

    config.addLabel('entities-menu', {
      en: 'Entities',
      ru: 'Сущности'
    })
  }
}
