'use strict';

var each = require('lodash/each');
var keyBy = require('lodash/keyBy');
var concat = require('lodash/concat');
var isEqual = require('lodash/isEqual');
var flattenDeep = require('lodash/flattenDeep');
var isUndefined = require('lodash/isUndefined');
var Component = require('substance/ui/Component');
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
    var childNodes = rubrics.getChildren(node.rubric_id);
    var childrenEls = [];

    childrenEls = childNodes.map(function(сhildNode) {
      return this.renderChildren($$, сhildNode, level + 1);
    }.bind(this));

    var el = $$('div').addClass('se-tree-node').ref(node.rubric_id)
      .on('click', this._toggleFacet.bind(this, node.rubric_id));
    if(rubrics.nodes[node.rubric_id].active) el.addClass('active');
    var levelSign = new Array(level).join('—') + ' ';
    el.append($$('span').addClass('se-tree-node-name').append(levelSign).append(node.name));
    el.append($$('span').addClass('se-tree-node-counter').append(node.count));

    return concat(el, childrenEls);
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

  this._loadFacets = function() {
    var documentClient = this.context.documentClient;

    var isTraining = this.props.training;
    var rubrics = this.props.rubrics;
    var facets = [];

    if(rubrics) {
      for(var key in rubrics.nodes) {
        if(rubrics.nodes[key].active) facets.push(key);
      }
    }

    if(!isEqual(this.state.facets, facets)) {
      this.send('filterFacets', facets);
    }

    documentClient.listFacets(facets, isTraining, function(err, result) {
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