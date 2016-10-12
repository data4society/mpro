import Inbox from './Inbox'

export default {
  name: 'inbox',
  configure: function(config) {
    config.addComponent('inbox', Inbox)

    config.addLabel('configurator-menu', {
      en: 'Configurator',
      ru: 'Конфигуратор'
    })
  }
}
