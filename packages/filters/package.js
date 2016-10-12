import Filters from './Filters'

export default {
  name: 'filters',
  configure: function(config) {
    config.addComponent('filters', Filters)
  }
}
