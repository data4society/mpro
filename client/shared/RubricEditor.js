'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var each = require('lodash/each');
var TreeItem = require('./TreeItem');

function RubricEditorPrompt() {
  RubricEditorPrompt.super.apply(this, arguments);
}

RubricEditorPrompt.Prototype = function() {

  this.render = function($$) {
    var doc = this.context.controller.getDocument();
    var rubricsMeta = doc.get(['meta','rubrics']);
    var tree = this.props.tree;

    if(tree) {
      each(tree.nodes, function(node){
        node.selected = false;
      });
      each(rubricsMeta, function(rubric) {
        tree.nodes[rubric].selected = true;
      }.bind(this));
    }

    var el = $$('div').addClass('se-prompt');
    
    el.append(
      $$('div').addClass('se-prompt-close').append(
        $$(Icon, {icon: 'fa-close'})
          .on('click', this._onClose.bind(this))
      ),
      $$('div').addClass('se-prompt-title').append(this.i18n.t('Pick up rubrics:'))
    );
    
    var childNodes = tree.getChildren("root");

    var childEls = childNodes.map(function(node) {
      return $$(TreeItem, {
        node: node,
        tree: tree,
        selected: node.selected || false,
      }).ref(node.rubric_id);
    }.bind(this));
    
    el.append(childEls);
    return el;
  };

  this._onClose = function(e) {
    e.preventDefault();
    this.parent.togglePrompt();
  };

};

Component.extend(RubricEditorPrompt);


var RubricEditor = function() {
  RubricEditor.super.apply(this, arguments);

  this.handleActions({
    'saveTree': this._saveTree
  });
};

RubricEditor.Prototype = function() {

  this.togglePrompt = function() {
    this.extendState({
      showPrompt: !this.state.showPrompt
    });
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-rubric-editor');
    var tree = this.props.rubrics;

    if (tree && this.state.showPrompt) {
      var prompt = $$(RubricEditorPrompt, {tree: tree}).ref('tree-editor');
      el.append(prompt);
    }

    return el;
  };

  this._saveTree = function() {
    var documentSession = this.context.documentSession;
    var rubricsList = this.parent.refs.rubricsList;
    var nodes = this.props.rubrics.nodes;
    var rubrics = [];
    each(nodes, function(node) {
      if(node.selected) rubrics.push(node.rubric_id);
    });
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'rubrics'], rubrics);
    });
    rubricsList.rerender();
    this.send('updateListRubrics', documentSession.documentId, rubrics);
  };
};

Component.extend(RubricEditor);

module.exports = RubricEditor;