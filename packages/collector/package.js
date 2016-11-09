import CollectorTool from './CollectorTool'
import CollectorCommand from './CollectorCommand'
import PagerPackage from '../pager/package'

export default {
  name: 'collector',
  configure: function(config) {
    config.import(PagerPackage)

    config.addTool('collector', CollectorTool, { target: 'collector' })
    config.addCommand('collector', CollectorCommand)
    config.addIcon('collector', { 'fontawesome': 'fa-bookmark-o' })
    config.addIcon('collector-active', { 'fontawesome': 'fa-bookmark' })
    config.addIcon('collector-checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('collector-unchecked', { 'fontawesome': 'fa-square-o' })
    config.addIcon('helper-on', { 'fontawesome': 'fa-question-circle' })
    config.addIcon('helper-off', { 'fontawesome': 'fa-question-circle-o' })

    config.addLabel('collection-search-placeholder', {
      en: 'Search collection',
      ru: 'Поиск коллекции'
    })
  }
}
