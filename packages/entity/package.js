'use strict';

var Entity = require('./Entity');
var ActTool = require('./ActTool');
var LocationTool = require('./LocationTool');
var OrgTool = require('./OrgTool');
var PersonTool = require('./PersonTool');
var EditEntityTool = require('./EditEntityTool');
var EntityComponent = require('./EntityComponent');
var EntityCommand = require('./EntityCommand');
var ActCommand = require('./ActCommand');
var LocationCommand = require('./LocationCommand');
var OrgCommand = require('./OrgCommand');
var PersonCommand = require('./PersonCommand');
var FormsPackage = require('../forms/package.js');

module.exports = {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity);
    config.addComponent(Entity.static.name, EntityComponent);
    config.addTool(ActTool, {viewer: true});
    config.addTool(LocationTool, {viewer: true});
    config.addTool(OrgTool, {viewer: true});
    config.addTool(PersonTool, {viewer: true});
    config.addTool(EditEntityTool, {overlay: true});
    config.addCommand(EntityCommand);
    config.addCommand(ActCommand);
    config.addCommand(LocationCommand);
    config.addCommand(OrgCommand);
    config.addCommand(PersonCommand);
    config.addIcon(ActCommand.static.name, { 'fontawesome': 'fa-balance-scale' });
    config.addIcon(LocationCommand.static.name, { 'fontawesome': 'fa-globe' });
    config.addIcon(OrgCommand.static.name, { 'fontawesome': 'fa-building' });
    config.addIcon(PersonCommand.static.name, { 'fontawesome': 'fa-users' });
    config.addIcon('delete', { 'fontawesome': 'fa-trash' });
    config.addStyle(__dirname, '_entity');
    config.addStyle(__dirname, '_entity-finder');
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

    config.import(FormsPackage);
  }
};