'use strict';

var Tool = require('substance/ui/Tool');
var extend = require('lodash/extend');
var each = require('lodash/each');
var Modal = require('substance/ui/Modal');
var RubricSelector = require('./RubricSelector');

/*
  Edit set of rubrics attached to the document.
*/

function RubricatorTool() {
  RubricatorTool.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._onModalClose
  });
}

RubricatorTool.Prototype = function() {

  this.getInitialState = function() {
    return {
      showModal: false
    };
  };

  this.render = function($$) {
    var el = $$('div')
      .addClass('se-tool');

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
    
    if(this.state.showModal) {
      var doc = this.context.doc;
      var rubricsMeta = doc.get(['meta','rubrics']);
      var rubrics = this.context.controller.props.rubrics;

      rubrics.resetSelection();

      each(rubricsMeta, function(id){
        rubrics.set([id, 'selected'], true);
      });

      el.append(
        $$(Modal, {
          width: 'large'
        }).append(
          $$(RubricSelector, {
            rubrics: this.context.controller.props.rubrics
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
  };

  this._onModalClose = function() {
    var showModal = this.state.showModal;
    this.setState({showModal: !showModal});
    if (!this.props.disabled && !this.state.showModal) this.performAction();
  };

  this.performAction = function(props) {
    var rubrics = this.context.controller.props.rubrics;
    this.context.commandManager.executeCommand(this.getCommandName(), extend({
      mode: this.props.mode,
      rubrics: rubrics.getSelected()
    }, props));
  };
};


Tool.extend(RubricatorTool);
RubricatorTool.static.name = 'rubricator';
module.exports = RubricatorTool;