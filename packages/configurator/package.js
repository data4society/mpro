import Configurator from './Configurator'

export default {
  name: 'configurator',
  configure: function(config) {
    config.addPage('configurator', Configurator)

    config.addLabel('inbox-menu', {
      en: 'Inbox',
      ru: 'Входящие'
    })
    config.addLabel('import-menu', {
      en: 'Import',
      ru: 'Импорт'
    })
  }
}