'use strict';

var Component = require('substance/ui/Component');
var map = require('lodash/map');
var concat = require('lodash/concat');
var isEmpty = require('lodash/isEmpty');
var flattenDeep = require('lodash/flattenDeep');

function Facets() {
  Component.apply(this, arguments);
}

Facets.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-facets');
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
    var isSelected = node.active;
    var hasSelectedChildren = rubrics.hasActiveChildren(node.id);
    var isExpanded = node.expanded || isSelected || hasSelectedChildren;
    var childNodes = rubrics.getChildren(node.id);
    var hideExpand = isEmpty(childNodes);
    var childrenEls = [];

    if(level === 1) {
      isExpanded = true;
      hideExpand = true;
    }

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1);
      }.bind(this));
    }

    var el = $$('div').addClass('se-tree-node').ref(node.id);

    if(isSelected) el.addClass('active');

    // level graphical nesting
    if(hideExpand && level !== 1) {
      level = level * 2;
      if(level === 4) level = 5;
    }
    var levelSign = new Array(level).join('·') + ' ';
    el.append(levelSign);

    if(!hideExpand) {
      var expandedIcon = isExpanded ? 'expanded' : 'collapsed';
      el.append(
        this.context.iconProvider.renderIcon($$, expandedIcon).addClass('expansion')
          .on('click', this._expandNode.bind(this, node.id))
      );
    }

    if(level === 1) {
      el.addClass('se-tree-title');
      el.append($$('span').addClass('se-tree-node-name').append(node.name));
    } else {
      el.on('click', this._toggleFacet.bind(this, node.id));
      el.append($$('span').addClass('se-tree-node-name').append(node.name));
      el.append($$('span').addClass('se-tree-node-counter').append(node.count));
    }

    return concat(el, childrenEls);
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

  this._toggleFacet = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.props.rubrics;
    var currentValue = rubrics.get([id, 'active']);
    rubrics.set([id, 'active'], !currentValue);
    this.extendProps({
      rubrics: rubrics
    });
  };

};

Component.extend(Facets);

module.exports = Facets;