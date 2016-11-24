import AcceptorTool from './AcceptorTool'
import AcceptorCommand from './AcceptorCommand'
import ModeratorTool from './ModeratorTool'
import ModeratorCommand from './ModeratorCommand'

export default {
  name: 'acceptor',
  configure: function(config) {
    config.addTool('acceptor', AcceptorTool, { target: 'acceptors' })
    config.addCommand('acceptor', AcceptorCommand)
    config.addIcon('acceptor', { 'fontawesome': 'fa-check' })

    config.addTool('moderator', ModeratorTool, { target: 'acceptors' })
    config.addCommand('moderator', ModeratorCommand)
    config.addIcon('moderator', { 'fontawesome': 'fa-user-secret' })
  }
}