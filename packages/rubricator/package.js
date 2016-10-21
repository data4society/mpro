import RubricatorTool from './RubricatorTool'
import RubricatorCommand from './RubricatorCommand'

export default {
  name: 'rubricator',
  configure: function(config) {
    config.addTool('rubricator', RubricatorTool, {viewer: true, editor: true})
    config.addCommand('rubricator', RubricatorCommand)
    config.addIcon('rubricator', { 'fontawesome': 'fa-tags' })
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' })
    config.addIcon('helper-on', { 'fontawesome': 'fa-question-circle' })
    config.addIcon('helper-off', { 'fontawesome': 'fa-question-circle-o' })
  }
}
