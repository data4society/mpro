import Facets from './Facets'

export default {
  name: 'facets',
  configure: function(config) {
    config.addComponent('facets', Facets)

    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
  }
}
