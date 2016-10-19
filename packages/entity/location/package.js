import LocationCommand from './LocationCommand'
import LocationTool from './LocationTool'

export default {
  name: 'act-entity',
  configure: function(config) {
    config.addCommand('location', LocationCommand, { nodeType: 'entity' })
    config.addTool('location', LocationTool, {target: 'entity'})
  }
}