import Fastart from './Fastart'

export default {
  name: 'fastart',
  configure: function(config) {
    config.addPage('rubrics', Fastart)

    config.addLabel('rubrics-menu', {
      en: 'Rubrics',
      ru: 'Рубрики'
    })
  }
}
