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
    var componentRegistry = this.context.configurator.getComponentRegistry();
    var Form = componentRegistry.get('form');

    var el = $$('div').addClass('sc-entity-editor');

    if(entity && doc) {
      var entityData = doc.get(entity.entity_class);
      var form = $$(Form, {node: entityData, session: this.state.session});

      el.append(form);
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
    }.bind(this));
  };

  this._updateEntity = function(data) {
    var entityId = this.props.entityId;
    var documentClient = this.context.documentClient;
    var entityData = {
      data: data
    };

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