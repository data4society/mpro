'use strict';

var Entity = require('./Entity');
var EntityTool = require('./EntityTool');
var EntityCommand = require('./EntityCommand');


module.exports = {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity);
    config.addTool(EntityTool, {viewer: true});
    config.addCommand(EntityCommand);
    config.addIcon(EntityCommand.static.name, { 'fontawesome': 'fa-users' });
    config.addStyle(__dirname, '_entity.scss');
    config.addLabel('entity', {
      en: 'Entity reference',
      ru: 'Упоминание сущности'
    });
  }
};