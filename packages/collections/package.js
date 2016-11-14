import Collections from './Collections'

export default {
  name: 'collections',
  configure: function(config) {
    config.addPage('collections', Collections)

    config.addIcon('collection-add', { 'fontawesome': 'fa-plus-square-o' })
    config.addIcon('collection-edit', { 'fontawesome': 'fa-edit' })
    config.addIcon('rule-remove', { 'fontawesome': 'fa-remove' })
    config.addIcon('rule-reapply', { 'fontawesome': 'fa-search-plus' })
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' })
    config.addIcon('helper-on', { 'fontawesome': 'fa-question-circle' })
    config.addIcon('helper-off', { 'fontawesome': 'fa-question-circle-o' })

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
