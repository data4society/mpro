import Collections from './Collections'

export default {
  name: 'collections',
  configure: function(config) {
    config.addPage('collections', Collections)

    config.addIcon('collection-add', { 'fontawesome': 'fa-plus-square-o' })
    config.addIcon('collection-edit', { 'fontawesome': 'fa-edit' })

    config.addLabel('collections-menu', {
      en: 'Collections',
      ru: 'Коллекции'
    })
    config.addLabel('collection-search-placeholder', {
      en: 'Search collection',
      ru: 'Поиск коллекции'
    })
  }
}
