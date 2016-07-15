'use strict';

var Component = require('substance/ui/Component');
var map = require('lodash/map');
var each = require('lodash/each');
var concat = require('lodash/concat');
var isEmpty = require('lodash/isEmpty');
var flattenDeep = require('lodash/flattenDeep');

function RubricSelector() {
  RubricSelector.super.apply(this, arguments);
}

RubricSelector.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-rubricator');
    var rubrics = this.props.rubrics;

    if(!isEmpty(rubrics)) {
      var childNodes = rubrics.getRoots();

      var childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1);
      }.bind(this));
      
      el.append(flattenDeep(childEls));
    }

    return el;
  };

  this.renderChildren = function($$, node, level) {

    var rubrics = this.props.rubrics;
    var isSelected = node.selected;
    var hasSelectedChildren = rubrics.hasSelectedChildren(node.id);
    var isExpanded = node.expanded || isSelected || hasSelectedChildren;
    var childNodes = rubrics.getChildren(node.id);
    var hideExpand = isEmpty(childNodes);
    var childrenEls = [];

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1);
      }.bind(this));
    }

    var el = $$('div').addClass('se-tree-node').ref(node.id)
      .on('click', this._expandNode.bind(this, node.id));

    el.addClass('level-' + level);

    if(!hideExpand) {
      var expandedIcon = isExpanded ? 'expanded' : 'collapsed';
      el.append(
        this.context.iconProvider.renderIcon($$, expandedIcon).addClass('expansion')
      );
    }

    if(level !== 1) {
      var selectedIcon = isSelected ? 'checked' : 'unchecked';
      if(isSelected) el.addClass('sm-selected');
      el.append(
        this.context.iconProvider.renderIcon($$, selectedIcon).addClass('selection')
          .on('click', this._selectNode.bind(this, node.id))
      );
    }

    el.append($$('span').addClass('se-tree-node-name').append(node.name));

    if(node.description) {
      var helpIcon = node.help ? 'helper-on' : 'helper-off';

      el.append(
        this.context.iconProvider.renderIcon($$, helpIcon).addClass('help')
          .on('click', this._toggleHelp.bind(this, node.id))
      );
      if(node.help) {
        el.append($$('div').addClass('se-node-help').append(node.description));
      }
    }

    return concat(el, childrenEls);
  };

  this._toggleHelp = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.props.rubrics;
    var show = rubrics.get([id, 'help']);
    rubrics.set([id, 'help'], !show);
    this.extendProps({
      rubrics: rubrics
    });
  };

  this._expandNode = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.props.rubrics;
    var isExpanded = rubrics.get([id, 'expanded']);
    rubrics.set([id, 'expanded'], !isExpanded);
    this.extendProps({
      rubrics: rubrics
    });
  };

  this._selectNode = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.props.rubrics;
    var isSelected = rubrics.get([id, 'selected']);
    rubrics.set([id, 'selected'], !isSelected);
    if(isSelected) {
      // Unselect all children
      var children = rubrics.getAllChildren(id);
      each(children, function(node_id) {
        rubrics.set([node_id, 'selected'], !isSelected);
      });
    } else {
      // Select all parents except root
      var parents = rubrics.getParents(id);
      each(parents, function(node_id) {
        if(rubrics.get(node_id).hasParent()) {
          rubrics.set([node_id, 'selected'], !isSelected);
        }
      });
    }
    this.extendProps({
      rubrics: rubrics
    });
    //this.send('saveTree');
  };
};

Component.extend(RubricSelector);

module.exports = RubricSelector;