'use strict';

var each = require('lodash/each');
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
    var isExpanded = this.props.expanded || isSelected;
    var childNodes = tree.getChildren(node.rubric_id);
    var hideExpand = childNodes.length === 0;

    var childrenEls = [];
    
    if(isExpanded) {
      childrenEls = childNodes.map(function(сhildNode) {
        return $$(TreeItem, {
          node: сhildNode,
          tree: tree,
          parentNode: this,
          selected: сhildNode.selected || false,
          expanded: сhildNode.expanded || false,
        }).ref(сhildNode.rubric_id);
      }.bind(this));
    }

    var el = $$('div').addClass('se-tree-node').ref(node.rubric_id)
      .on('click', this._onNodeSelect.bind(this, node.rubric_id));

    if(!hideExpand) {
      var expandedIcon = isExpanded ? 'fa-caret-down' : 'fa-caret-right';
      el.append(
        $$(Icon, {icon: expandedIcon + ' expansion'})
          .on('click', this._onNodeExpand.bind(this, node.rubric_id))
      );
    } else {
      el.addClass('hide-expand');
    }

    var selectedIcon = isSelected ? 'fa-check-square-o' : 'fa-square-o';
    el.append($$(Icon, {icon: selectedIcon + ' selection'}));

    el.append(
      $$('span').addClass('name')
        .html(node.name),
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
    this._updateParents(item, !selected);
    this.send('saveTree');
  };

  this._updateParents = function(item, selected) {
    var nodes = [item];
    function collectParents(item) {
      if(item.props.parentNode) {
        nodes.push(item.props.parentNode);
        collectParents(item.props.parentNode);
      }
    }
    collectParents(item);
    nodes.reverse();
    each(nodes, function(node) {
      node.extendProps({
        'selected': selected
      });
      this.props.tree.nodes[node.props.node.rubric_id].selected = selected;
    }.bind(this));
  };

  this._onNodeExpand = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var item = this.refs[id];
    var expanded = item.props.expanded || false;
    item.extendProps({
      'expanded': !expanded
    });
    // Hack: should remove it, maybe with changing tree and extending it
    this.props.tree.nodes[id].expanded = !expanded;
  };

  this._isTreeItem = function(comp) {
    return comp.constructor.name == 'TreeItem';
  };
};

Component.extend(TreeItem);

module.exports = TreeItem;