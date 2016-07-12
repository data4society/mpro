'use strict';

var Document = require('substance/model/Document');
var RubricsIndex = require('./RubricsIndex');
var each = require('lodash/each');
var map = require('lodash/map');

/*
  Rubrics model.

  Holds all rubrics.
*/

function Rubrics(schema) {
  Document.call(this, schema);
  this.addIndex('rubrics', new RubricsIndex(this));
}

Rubrics.Prototype = function() {
  
  // Get children nodes for a given node
  this.getChildren = function(nodeId) {
    var index = this.getIndex('rubrics').index;
    var children = index.get(nodeId);

    if(children) {
      return children.rubric;
    } else {
      return {};
    }
  };

  // Collect all children nodes of a node
  // returns list of ids
  this.getAllChildren = function(nodeId) {
    var childNodes = this.getChildren(nodeId);
    if (childNodes.length === 0) return [];
    var allChildren = map(childNodes, 'id');
    each(childNodes, function(childNode) {
      allChildren = allChildren.concat(this.getAllChildren(childNode.id));
    }.bind(this));
    return allChildren;
  };

  // Get parent node for a given nodeId
  this.getParent = function(nodeId) {
    return this.get(nodeId).getParent();
  };

  // Collect all parents of a given node
  // returns list of ids
  this.getParents = function(nodeId) {
    var node = this.get(nodeId);
    var parents = [];
    while (node.hasParent()) {
      node = node.getParent();
      parents.push(node.id);
    }
    return parents;
  };

  // Get root parent node
  this.getRootParent = function(nodeId) {
    return this.get(nodeId).getRoot();
  };

  // Get all root nodes
  this.getRoots = function() {
    var index = this.getIndex('rubrics').index;
    var roots = [];
    each(index, function(node, nodeId) {
      var node = this.get(nodeId);
      if(!node.hasParent()) roots.push(node);
    }.bind(this));
    return roots;
  };

  // Get ids of all active nodes
  this.getActive = function() {
    var active = [];
    var rubricNodes = this.getIndex('type').get('rubric');
    each(rubricNodes, function(node) {
      if(node.active) active.push(node.id);
    });
    return active;
  };

  this.hasActiveChildren = function(nodeId) {
    var result = false;
    var children = this.getAllChildren(nodeId);
    each(children, function(childId) {
      var node = this.get(childId);
      if(node.active) {
        result = true;
        return false;
      }
    }.bind(this));
    return result;
  };
};

Document.extend(Rubrics);

module.exports = Rubrics;