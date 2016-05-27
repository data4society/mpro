'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var each = require('lodash/each');
var TreeItem = require('./TreeItem');

function ThematicEditorPrompt() {
  ThematicEditorPrompt.super.apply(this, arguments);
}

ThematicEditorPrompt.Prototype = function() {

  this.render = function($$) {
    var tree = this.props.tree;
    var el = $$('div').addClass('se-prompt');
    
    el.append(
      $$('div').addClass('se-prompt-close').append(
        $$(Icon, {icon: 'fa-close'})
          .on('click', this._onClose.bind(this))
      ),
      $$('div').addClass('se-prompt-title').append(this.i18n.t('Pick up categories:'))
    );
    
    var childNodes = tree.getChildren("root");

    var childEls = childNodes.map(function(node) {
      return $$(TreeItem, {
        node: node,
        tree: tree,
        selected: node.selected
      });
    }.bind(this));
    
    el.append(childEls);
    return el;
  };

  this._onClose = function(e) {
    e.preventDefault();
    this.parent.togglePrompt();
  };

};

Component.extend(ThematicEditorPrompt);


var ThematicEditor = function() {
  ThematicEditor.super.apply(this, arguments);

  this.handleActions({
    'saveTree': this._saveTree
  });
};

ThematicEditor.Prototype = function() {

  this.togglePrompt = function() {
    this.extendState({
      showPrompt: !this.state.showPrompt
    });
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-thematic-editor');
    var tree = this.props.thematics;

    if (tree && this.state.showPrompt) {
      var prompt = $$(ThematicEditorPrompt, {tree: tree}).ref('tree-editor');
      el.append(prompt);
    }

    return el;
  };

  this._saveTree = function() {
    var documentSession = this.context.documentSession;
    var categoriesList = this.parent.refs.categoriesList;
    var nodes = this.props.thematics.nodes;
    var categories = [];
    each(nodes, function(node) {
      if(node.selected) categories.push(node.thematic_id);
    });
    documentSession.transaction(function(tx) {
      tx.set(['meta', 'categories'], categories);
    });
    categoriesList.rerender();
    this.send('updateListCategories', documentSession.documentId, categories);
  };
};

Component.extend(ThematicEditor);

module.exports = ThematicEditor;