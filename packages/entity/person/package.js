import PersonCommand from './PersonCommand'
import PersonTool from './PersonTool'

export default {
  name: 'act-entity',
  configure: function(config) {
    config.addCommand('person', PersonCommand, { nodeType: 'entity' })
    config.addTool('person', PersonTool, {target: 'entity'})
  }
}