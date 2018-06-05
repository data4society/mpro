import AcceptorTool from './AcceptorTool'
import AcceptorCommand from './AcceptorCommand'
import ModeratorTool from './ModeratorTool'
import ModeratorCommand from './ModeratorCommand'
import NegativeTool from './NegativeTool'
import NegativeCommand from './NegativeCommand'
import OIExpressTool from './OIExpressTool'
import OIExpressCommand from './OIExpressCommand'

export default {
  name: 'acceptor',
  configure: function(config) {
    config.addTool('acceptor', AcceptorTool, { target: 'acceptors' })
    config.addCommand('acceptor', AcceptorCommand)
    config.addIcon('acceptor', { 'fontawesome': 'fa-check' })

    config.addTool('moderator', ModeratorTool, { target: 'acceptors' })
    config.addCommand('moderator', ModeratorCommand)
    config.addIcon('moderator', { 'fontawesome': 'fa-user-secret' })

    config.addTool('negative', NegativeTool, { target: 'acceptors' })
    config.addCommand('negative', NegativeCommand)
    config.addIcon('negative', { 'fontawesome': 'fa-trash' })

    config.addTool('oi_express', OIExpressTool, { target: 'acceptors' })
    config.addCommand('oi_express', OIExpressCommand)
    config.addIcon('oi_express', { 'fontawesome': 'fa-newspaper-o' })
  }
}
