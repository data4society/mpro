import Header from './Header'

export default {
  name: 'header',
  configure: function(config) {
    config.addComponent('header', Header)
    config.addIcon('header-app', { 'fontawesome': 'fa-plug' })
  }
}