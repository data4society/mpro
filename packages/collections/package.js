import Collections from './Collections'

export default {
  name: 'collections',
  configure: function(config) {
    config.addPage('collections', Collections)

    config.addIcon('rule-add', { 'fontawesome': 'fa-plus-square-o' })
    config.addIcon('collection-add', { 'fontawesome': 'fa-plus-square-o' })
    config.addIcon('collection-edit', { 'fontawesome': 'fa-edit' })
    config.addIcon('rule-remove', { 'fontawesome': 'fa-trash' })
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
    config.addLabel('add-collection', {
      en: 'Add collection',
      ru: 'Добавить коллекцию'
    })
    config.addLabel('edit-collection', {
      en: 'Edit collection',
      ru: 'Редактировать коллекцию'
    })
    config.addLabel('add-rule', {
      en: 'Add rule',
      ru: 'Добавить правило'
    })
    config.addLabel('add-rule-description', {
      en: 'Add a new rule for automic applying to new documents',
      ru: 'Добавить правило'
    })
    config.addLabel('remove-rule', {
      en: 'Remove',
      ru: 'Удалить'
    })
    config.addLabel('remove-rule-description', {
      en: 'Remove this rule from current collection',
      ru: 'Удалить правило из поиска новых документов'
    })
    config.addLabel('reapply-rule', {
      en: 'Reapply',
      ru: 'Применить заново'
    })
    config.addLabel('reapply-rule-description', {
      en: 'Reapply this rule to all existing documents',
      ru: 'Применить данное правило заново ко всем документам'
    })
  }
}
