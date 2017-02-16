import Fts from './Fts'

export default {
  name: 'fts',
  configure: function(config) {
    config.addComponent('fts-filter', Fts)
    config.addIcon('search', { 'fontawesome': 'fa-search' })
    config.addIcon('reset-search', { 'fontawesome': 'fa-times' })
    config.addLabel('fts-label', {
      en: 'Search',
      ru: 'Поиск'
    })
  }
}
