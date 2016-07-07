'use strict';

var Entity = require('./Entity');
var EntityTool = require('./EntityTool');
var EntityCommand = require('./EntityCommand');


module.exports = {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity);
    config.addTool(EntityTool);
    config.addCommand(EntityCommand);
  }
};