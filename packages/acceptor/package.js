import AcceptorTool from './AcceptorTool'
import AcceptorCommand from './AcceptorCommand'

export default {
  name: 'acceptor',
  configure: function(config) {
    config.addTool('acceptor', AcceptorTool, {editor: true})
    config.addCommand('acceptor', AcceptorCommand)
    config.addIcon('acceptor', { 'fontawesome': 'fa-check' })
  }
}