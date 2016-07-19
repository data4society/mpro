'use strict';

var Entity = require('./Entity');
var EntityTool = require('./EntityTool');
var EditEntityTool = require('./EditEntityTool');
var EntityCommand = require('./EntityCommand');
var EntityComponent = require('./EntityComponent');

module.exports = {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity);
    config.addComponent(Entity.static.name, EntityComponent);
    config.addTool(EntityTool, {viewer: true});
    config.addTool(EditEntityTool, {overlay: true});
    config.addCommand(EntityCommand);
    config.addIcon(EntityCommand.static.name, { 'fontawesome': 'fa-users' });
    config.addStyle(__dirname, '_entity');
    config.addLabel('entity', {
      en: 'Entity reference',
      ru: 'Упоминание сущности'
    });
    config.addLabel('edit-entity', {
      en: 'Entity reference',
      ru: 'Редактировать сущность'
    });
    config.addLabel('delete-ref', {
      en: 'Entity reference',
      ru: 'Удалить упоминание'
    });
  }
};