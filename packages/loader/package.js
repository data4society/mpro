import Loader from './Loader'

export default {
  name: 'loader',
  configure: function(config) {
    config.addComponent('loader', Loader)
    config.addLabel('no-document', {
      en: 'Click on document to open',
      ru: 'Нажмите на документ для открытия'
    })
  }
}
