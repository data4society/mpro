import OrgCommand from './OrgCommand'
import OrgTool from './OrgTool'

export default {
  name: 'act-entity',
  configure: function(config) {
    config.addCommand('org', OrgCommand, { nodeType: 'entity' })
    config.addTool('org', OrgTool, {target: 'entity'})
  }
}