import Collections from './Collections'

export default {
  name: 'collections',
  configure: function(config) {
    config.addPage('collections', Collections)

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
