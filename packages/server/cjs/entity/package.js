let Entity = require('./Entity')

module.exports = {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity);
  }
}