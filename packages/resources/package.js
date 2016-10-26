import EntityEditorPackage from '../entity-editor/package'
import Resources from './Resources'

export default {
  name: 'resources',
  configure: function(config) {
    config.import(EntityEditorPackage)
    config.addPage('resources', Resources)

    config.addLabel('configurator-resources', {
      en: 'Resources',
      ru: 'Сущности'
    })
  }
}
