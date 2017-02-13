import Cover from './Cover'
import Summary from './Summary'

export default {
  name: 'cover',
  configure: function(config) {
    config.addComponent('cover', Cover)
    config.addComponent('summary', Summary)
    config.addIcon('rubrics', { 'fontawesome': 'fa-tags' })
    config.addIcon('probability', { 'fontawesome': 'fa-magic' })
    config.addLabel('no-rubrics', {
      en: 'No rubrics were attached to this document',
      ru: 'Этот документ не связан ни с одной рубрикой'
    })
  }
}
