import { EditAnnotationCommand } from 'substance'

import ActPackage from './act/package'
import LocationPackage from './location/package'
import OrgPackage from './org/package'
import PersonPackage from './person/package'


import Entity from './Entity'

import EditEntityTool from './EditEntityTool'
import EntityComponent from './EntityComponent'
import FormsPackage from '../forms/package'

export default {
  name: 'entity',
  configure: function(config) {
    config.addNode(Entity)
    config.addComponent('entity', EntityComponent)
    config.import(ActPackage)
    config.import(LocationPackage)
    config.import(OrgPackage)
    config.import(PersonPackage)

    config.addCommand('edit-entity', EditAnnotationCommand, { nodeType: Entity.type })
    config.addTool('edit-entity', EditEntityTool, { target: 'overlay' })

    config.addIcon('norm_act', { 'fontawesome': 'fa-balance-scale' })
    config.addIcon('location', { 'fontawesome': 'fa-globe' })
    config.addIcon('org', { 'fontawesome': 'fa-building' })
    config.addIcon('person', { 'fontawesome': 'fa-users' })
    config.addIcon('delete', { 'fontawesome': 'fa-trash' })
    config.addLabel('entity', {
      en: 'Entity reference',
      ru: 'Упоминание сущности'
    })
    config.addLabel('edit-entity', {
      en: 'Entity reference',
      ru: 'Редактировать сущность'
    })
    config.addLabel('delete-ref', {
      en: 'Entity reference',
      ru: 'Удалить упоминание'
    })

    config.import(FormsPackage)
  }
}