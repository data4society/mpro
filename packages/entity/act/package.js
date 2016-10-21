import ActCommand from './ActCommand'
import ActTool from './ActTool'

export default {
  name: 'act-entity',
  configure: function(config) {
    config.addCommand('norm_act', ActCommand, { nodeType: 'entity' })
    config.addTool('norm_act', ActTool, {target: 'entity'})
  }
}