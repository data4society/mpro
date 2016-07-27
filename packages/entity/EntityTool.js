'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');
var Modal = require('substance/ui/Modal');
var extend = require('lodash/extend');
var EntityFinder = require('./EntityFinder');

function EntityTool() {
  EntityTool.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._onModalClose,
    'createReference': this._createReference
  });
}

EntityTool.Prototype = function() {

  this.render = function($$) {
    var el = $$('div')
      .addClass('se-tool sm-annotation-tool');

    var customClassNames = this.getClassNames();
    if (customClassNames) {
      el.addClass(customClassNames);
    }

    var title = this.getTitle();
    if (title) {
      el.attr('title', title);
      el.attr('aria-label', title);
    }
    //.sm-disabled
    if (this.props.disabled) {
      el.addClass('sm-disabled');
    }
    // .sm-active
    if (this.props.active) {
      el.addClass('sm-active');
    }

    // button
    el.append(this.renderButton($$));
    
    if(this.state.showModal && this.props.mode === 'create') {

      el.append(
        $$(Modal, {
          width: 'middle'
        }).append(
          $$(EntityFinder, {
            entityClass: this.getEntityClass()
          }).ref('selector')
        )
      );
    }

    return el;
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var showModal = this.state.showModal;
    this.setState({showModal: !showModal});
    if (!this.props.disabled && this.props.mode !== 'create') this.performAction();
  };

  this._onModalClose = function() {
    var showModal = this.state.showModal;
    this.setState({showModal: !showModal});
  };

  this._createReference = function(ref) {
    var showModal = this.state.showModal;
    this.setState({showModal: !showModal, reference: ref});
    if (!this.props.disabled && !this.state.showModal) this.performAction();
  };

  this.getEntityClass = function() {
    return this.getName();
  };

  /**
    Executes the associated command
  */
  this.performAction = function(props) {
    this.context.commandManager.executeCommand(this.getCommandName(), extend({
      mode: this.props.mode,
      node: {
        entityClass: this.getEntityClass(),
        reference: this.state.reference
      }
    }, props));
  };
};

AnnotationTool.extend(EntityTool);

EntityTool.static.name = 'entity';

module.exports = EntityTool;