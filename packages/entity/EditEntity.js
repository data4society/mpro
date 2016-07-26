'use strict';

var Component = require('substance/ui/Component');
var DocumentSession = require('substance/model/DocumentSession');
var extend = require('lodash/extend');

/*
  Editing of Entity
*/
function EditEntity() {
  EditEntity.super.apply(this, arguments);
}

EditEntity.Prototype = function() {

  this.didMount = function() {
    this._loadEntity();
  };

  this.dispose = function() {
    var doc = this.state.doc;
    if(doc) {
      doc.off(this);
    }
  };

  this.render = function($$) {
    var doc = this.state.doc;
    var entity = this.state.entity;
    var controller = this.context.controller;
    var componentRegistry = controller.props.configurator.getComponentRegistry();
    var Form = componentRegistry.get('form');

    var el = $$('div').addClass('sc-entity-editor');

    if(entity && doc) {
      var entityData = doc.get(entity.entity_class);
      var form = $$(Form, {node: entityData, session: this.state.session});

      el.append(form);
    } else {
      el.append('There is no handler for this entity class, sorry');
    }

    return el;
  };

  this._loadEntity = function() {
    var entityId = this.props.entityId;
    var mproConfigurator = this.context.configurator;
    var configurator = mproConfigurator.getConfigurator('mpro-entities');
    var documentClient = this.context.documentClient;

    documentClient.getEntity(entityId, function(err, entity) {
      if(err) {
        console.error(err);
        this.setState({
          error: new Error('Entity loading failed')
        });
        return;
      }

      var entityClass = entity.entity_class;
      var container = configurator.createArticle();

      if(container.schema.getNodeClass(this.props.node.entityClass)) {
        var entityData = {
          id: entityClass,
          type: entityClass
        };

        entityData = extend(entityData, entity.data);
        container.create(entityData);

        container.on('document:changed', this._onDocumentChanged, this);

        var session = new DocumentSession(container);

        this.setState({
          doc: container,
          session: session,
          entity: entity
        });
      }
    }.bind(this));
  };

  this._updateEntity = function(data) {
    var entityId = this.props.entityId;
    var documentClient = this.context.documentClient;
    var entityData = {
      data: data.toJSON()
    };
    // Remove node props
    delete entityData.data.id;
    delete entityData.data.type;

    documentClient.updateEntity(entityId, entityData, function(err) {
      if(err) {
        console.error(err);
        this.setState({
          error: new Error('Entity update failed')
        });
        return;
      }
    }.bind(this));
  };

  this._onDocumentChanged = function() {
    var doc = this.state.doc;
    var entity = this.state.entity;
    var entityData = doc.get(entity.entity_class);
    this._updateEntity(entityData);
  };
};

Component.extend(EditEntity);

module.exports = EditEntity;