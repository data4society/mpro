import Resources from './Resources'

export default {
  name: 'resources',
  configure: function(config) {
    config.addPage('resources', Resources)

    config.addLabel('configurator-resources', {
      en: 'Resources',
      ru: 'Сущности'
    })
  }
}
