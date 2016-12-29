import AcceptorFilter from './AcceptorFilter'

export default {
  name: 'acceptor-filter',
  configure: function(config) {
    config.addComponent('acceptor-filter', AcceptorFilter)

    config.addIcon('acceptor', { 'fontawesome': 'fa-check' })
    config.addIcon('moderator', { 'fontawesome': 'fa-user-secret' })
  }
}
