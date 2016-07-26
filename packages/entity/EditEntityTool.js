'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');
var Modal = require('substance/ui/Modal');
var Prompt = require('substance/ui/Prompt');
var EditEntity = require('./EditEntity');

/*
  Edit an entity reference in a prompt.
*/
function EditEntityTool() {
  EditEntityTool.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._doneEditing,
    'doneEditing': this._doneEditing
  });
}

EditEntityTool.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-edit-entity-tool');

    el.append(
      $$(Prompt).append(
        $$(Prompt.Label, {label: node.entityClass}),
        $$(Prompt.Separator),
        $$(Prompt.Action, {name: 'edit', title: this.getLabel('edit-entity')})
          .on('click', this._onEdit),
        $$(Prompt.Action, {name: 'delete', title: this.getLabel('delete-ref')})
          .on('click', this._onDelete)
      )
    );

    if (this.state.edit) {
      el.append(
        $$(Modal, {
          width: 'middle'
        }).append(
          $$(EditEntity, {entityId: node.reference, node: node})
        )
      );
    }
    return el;
  };

  this._onEdit = function() {
    this.setState({
      edit: true
    });
  };

  this._doneEditing = function() {
    this.setState({
      edit: false
    });
  };

  this._onDelete = function(e) {
    e.preventDefault();
    var node = this.props.node;
    var sm = this.context.surfaceManager;
    var surface = sm.getFocusedSurface();
    surface.transaction(function(tx, args) {
      tx.delete(node.id);
      return args;
    });
  };
};

Component.extend(EditEntityTool);

EditEntityTool.static.getProps = function(commandStates) {
  if (commandStates.entity.mode === 'edit') {
    return clone(commandStates.entity);
  } else {
    return undefined;
  }
};

EditEntityTool.static.name = 'edit-entity';

module.exports = EditEntityTool;