import Apis from './Apis'

export default {
  name: 'apis',
  configure: function(config) {
    config.addPage('api', Apis)

    config.addLabel('api-menu', {
      en: 'APIs',
      ru: 'APIs'
    })
  }
}
