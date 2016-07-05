'use strict';

var each = require('lodash/each');
var concat = require('lodash/concat');
var flattenDeep = require('lodash/flattenDeep');
var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');

var RubricSelector = function() {
  RubricSelector.super.apply(this, arguments);
};

RubricSelector.Prototype = function() {

  this.render = function($$) {
    var el = $$('div').addClass('sc-rubric-selector');
    var rubrics = this.props.rubrics;
    if(rubrics){

      var childNodes = rubrics.getChildren("root");

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
    var isExpanded = node.expanded || isSelected;
    var childNodes = rubrics.getChildren(node.rubric_id);
    var hideExpand = childNodes.length === 0;
    var childrenEls = [];

    // Expand branch if root have at least one selected child
    if(level === 1) {
      each(childNodes, function(node) {
        if(node.selected) isExpanded = true;
      });
    }

    if(isExpanded) {
      childrenEls = childNodes.map(function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1);
      }.bind(this));
    }

    var el = $$('div').addClass('se-tree-node').ref(node.rubric_id)
      .on('click', this._expandNode.bind(this, node.rubric_id));

    // level graphical nesting
    if(hideExpand) {
      level = level * 2;
      if(level == 4) level = 5;
    }
    var levelSign = new Array(level).join('·') + ' ';
    el.append(levelSign);

    if(!hideExpand) {
      var expandedIcon = isExpanded ? 'fa-caret-down' : 'fa-caret-right';
      el.append(
        $$(Icon, {icon: expandedIcon + ' expansion'})
      );
    }

    if(level !== 1) {
      var selectedIcon = isSelected ? 'fa-check-square-o' : 'fa-square-o';
      el.append(
        $$(Icon, {icon: selectedIcon + ' selection'})
          .on('click', this._selectNode.bind(this, node.rubric_id))
      );
    }

    el.append($$('span').addClass('se-tree-node-name').append(node.name));

    if(node.description) {
      var helpIcon = node.help ? 'fa-question-circle' : 'fa-question-circle-o';

      el.append(
        $$(Icon, {icon: helpIcon + ' help'})
          .on('click', this._toggleHelp.bind(this, node.rubric_id))
      );
      if(node.help) {
        el.append($$('div').addClass('se-node-help').append(node.description));
      }
    }

    return concat(el, childrenEls);
  };

  this._toggleHelp = function(rubric_id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.props.rubrics;
    var show = rubrics.nodes[rubric_id].help;
    rubrics.nodes[rubric_id].help = !show;
    this.extendProps({
      rubrics: rubrics
    });
  };

  this._expandNode = function(rubric_id) {
    var rubrics = this.props.rubrics;
    var isExpanded = rubrics.nodes[rubric_id].expanded;
    rubrics.nodes[rubric_id].expanded = !isExpanded;
    this.extendProps({
      rubrics: rubrics
    });
  };

  this._selectNode = function(rubric_id) {
    var rubrics = this.props.rubrics;
    var isSelected = rubrics.nodes[rubric_id].selected;
    rubrics.nodes[rubric_id].selected = !isSelected;
    if(isSelected) {
      // Unselect all children
      var children = rubrics.getAllChildren(rubric_id);
      each(children, function(node) {
        rubrics.nodes[node].selected = !isSelected;
      });
    } else {
      // Select all parents except root
      var parents = rubrics.getParents(rubric_id);
      each(parents, function(node_id) {
        if(rubrics.nodes[node_id].parent_id) {
          rubrics.nodes[node_id].selected = !isSelected;
        }
      });
    }
    this.extendProps({
      rubrics: rubrics
    });
    this.send('saveTree');
  };
};

Component.extend(RubricSelector);

module.exports = RubricSelector;