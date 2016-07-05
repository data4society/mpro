'use strict';

var each = require('lodash/each');
var keyBy = require('lodash/keyBy');
var concat = require('lodash/concat');
var isEqual = require('lodash/isEqual');
var flattenDeep = require('lodash/flattenDeep');
var isUndefined = require('lodash/isUndefined');
var Component = require('substance/ui/Component');
var Icon = require('substance/ui/FontAwesomeIcon');
var Err = require('substance/util/Error');

function Facets() {
  Component.apply(this, arguments);
}

Facets.Prototype = function() {

  this.getInitialState = function() {
    return {
      facets: []
    };
  };

  this.didMount = function() {
    this._loadFacets();
  };

  this.willReceiveProps = function() {
    this._loadFacets();
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-facets');
    var rubrics = this.state.rubrics;
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
    var rubrics = this.state.rubrics;
    var isSelected = node.active;
    var isExpanded = node.expanded || isSelected;
    var childNodes = rubrics.getChildren(node.rubric_id);
    var hideExpand = childNodes.length === 0;
    var childrenEls = [];

    if(level === 1) {
      isExpanded = true;
      hideExpand = true;
    }

    if(isExpanded) {
      childrenEls = childNodes.map(function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1);
      }.bind(this));
    }

    var el = $$('div').addClass('se-tree-node').ref(node.rubric_id);

    if(isSelected) el.addClass('active');

    // level graphical nesting
    if(hideExpand && level !== 1) {
      level = level * 2;
      if(level == 4) level = 5;
    }
    var levelSign = new Array(level).join('·') + ' ';
    el.append(levelSign);

    if(!hideExpand) {
      var expandedIcon = isExpanded ? 'fa-caret-down' : 'fa-caret-right';
      el.append(
        $$(Icon, {icon: expandedIcon + ' expansion'})
          .on('click', this._expandNode.bind(this, node.rubric_id))
      );
    }

    if(level === 1) {
      el.addClass('se-tree-title');
      el.append($$('span').addClass('se-tree-node-name').append(node.name));
    } else {
      el.on('click', this._toggleFacet.bind(this, node.rubric_id));
      el.append($$('span').addClass('se-tree-node-name').append(node.name));
      el.append($$('span').addClass('se-tree-node-counter').append(node.count));
    }

    return concat(el, childrenEls);
  };

  this._expandNode = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.state.rubrics;
    var isExpanded = rubrics.nodes[id].expanded;
    rubrics.nodes[id].expanded = !isExpanded;
    this.extendProps({
      rubrics: rubrics
    });
  };

  this._toggleFacet = function(id, e) {
    e.preventDefault();
    e.stopPropagation();
    var rubrics = this.state.rubrics;
    var currentValue = rubrics.nodes[id].active;
    rubrics.nodes[id].active = !currentValue;
    this.extendProps({
      rubrics: rubrics
    });
  };

  this._loadFacets = function(silent) {
    var documentClient = this.context.documentClient;

    var isTraining = this.props.training;
    var rubrics = this.props.rubrics;
    var activeFacets = [];

    if(rubrics) {
      for(var key in rubrics.nodes) {
        if(rubrics.nodes[key].selected) activeFacets.push(key);
      }
    }

    if(!isEqual(this.state.facets, activeFacets) && !silent) {
      this.send('filterFacets', activeFacets);
    }

    documentClient.listFacets(activeFacets, isTraining, function(err, result) {
      if (err) {
        this.setState({
          error: new Err('Feed.LoadingError', {
            message: 'Facets could not be loaded.',
            cause: err
          })
        });
        console.error('ERROR', err);
        return;
      }
      
      var facets = keyBy(result, function(item) {
        return item.rubric;
      });

      if(rubrics) {
        each(rubrics.nodes, function(node) {
          node.count = !isUndefined(facets[node.rubric_id]) ? facets[node.rubric_id].cnt : '0';
        });
      }

      this.extendState({
        rubrics: rubrics,
        facets: facets
      });
    }.bind(this));
  };

};

Component.extend(Facets);

module.exports = Facets;