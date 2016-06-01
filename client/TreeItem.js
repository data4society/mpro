'use strict';

var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');

var TreeItem = function() {
  TreeItem.super.apply(this, arguments);
};

TreeItem.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var tree = this.props.tree;
    var isSelected = this.props.selected;
    var childNodes = tree.getChildren(node.rubric_id);

    var childrenEls = [];
    
    childrenEls = childNodes.map(function(node) {
      return $$(TreeItem, {
        node: node,
        tree: tree,
        selected: node.selected
      });
    }.bind(this));

    var el = $$('div').addClass('se-tree-node').ref(node.rubric_id)
      .on('click', this._onNodeSelect.bind(this, node.rubric_id));

    if(isSelected) {
      el.append($$(Icon, {icon: 'fa-check-square-o'}));
    } else {
      el.append($$(Icon, {icon: 'fa-square-o'}));
    }

    el.append(
      $$('span').addClass('name')
        .html(node.title),
      $$('div').addClass('children').append(
        childrenEls
      )
    );

    return el;
  };

  this._onNodeSelect = function(id, e) {
    e.stopPropagation();
    var item = this.refs[id];
    var selected = item.props.selected || false;
    item.extendProps({
      'selected': !selected
    });
    // Hack: should remove it, maybe with changing tree and extending it
    this.props.tree.nodes[id].selected = !selected;
    this.send('saveTree');
  };
};

Component.extend(TreeItem);

module.exports = TreeItem;