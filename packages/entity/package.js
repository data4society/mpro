import Entity from './Entity'
import ActTool from './ActTool'
import LocationTool from './LocationTool'
import OrgTool from './OrgTool'
import PersonTool from './PersonTool'
import EditEntityTool from './EditEntityTool'
import EntityComponent from './EntityComponent'
import EntityCommand from './EntityCommand'
import ActCommand from './ActCommand'
import LocationCommand from './LocationCommand'
import OrgCommand from './OrgCommand'
import PersonCommand from './PersonCommand'
import FormsPackage from '../forms/package'

export default {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity);
    config.addComponent('entity', EntityComponent);
    config.addTool('norm_act', ActTool, {viewer: true});
    config.addTool('location', LocationTool, {viewer: true});
    config.addTool('org', OrgTool, {viewer: true});
    config.addTool('person', PersonTool, {viewer: true});
    config.addTool('edit-entity', EditEntityTool, {overlay: true});
    config.addCommand('norm_act', ActCommand);
    config.addCommand('entity', EntityCommand);
    config.addCommand('location', LocationCommand);
    config.addCommand('org', OrgCommand);
    config.addCommand('person', PersonCommand);
    config.addIcon('norm_act', { 'fontawesome': 'fa-balance-scale' });
    config.addIcon('location', { 'fontawesome': 'fa-globe' });
    config.addIcon('org', { 'fontawesome': 'fa-building' });
    config.addIcon('person', { 'fontawesome': 'fa-users' });
    config.addIcon('delete', { 'fontawesome': 'fa-trash' });
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

    config.import(FormsPackage)
  }
}