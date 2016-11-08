import CollectorTool from './CollectorTool'
import CollectorCommand from './CollectorCommand'

export default {
  name: 'collector',
  configure: function(config) {
    config.addTool('collector', CollectorTool, { target: 'collector' })
    config.addCommand('collector', CollectorCommand)
    config.addIcon('collector', { 'fontawesome': 'fa-bookmark-o' })
    config.addIcon('collector-checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('collector-unchecked', { 'fontawesome': 'fa-square-o' })
    config.addIcon('helper-on', { 'fontawesome': 'fa-question-circle' })
    config.addIcon('helper-off', { 'fontawesome': 'fa-question-circle-o' })
  }
}
