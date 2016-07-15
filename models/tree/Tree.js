var map = require('lodash/map');
var each = require('lodash/each');
var sortBy = require('lodash/sortBy');

// A simple tree implementation
// -------------

var Tree = function(nodes) {
  this.nodes = nodes;
  this.buildIndexes();
};

Tree.Prototype = function() {

  this.buildIndexes = function() {
    // Build a map of parents referencing their kids
    this.parentIndex = {};
    each(this.nodes, function(node) {
      var parent = node.parent_id || "root";
      if (!this.parentIndex[parent]) {
        this.parentIndex[parent] = [ node ];
      } else {
        this.parentIndex[parent].push(node);
      }
    }.bind(this));

    // Sort each leaf by node position
    each(this.parentIndex, function(leaf, parent) {
      this.parentIndex[parent] = sortBy(leaf, function(node){ return node.position; });
    }.bind(this));
  };

  // Get a node by id
  this.get = function(id) {
    return this.nodes[id];
  };

  // Get children nodes for a given node using our parentIndex
  this.getChildren = function(nodeId) {
    return this.parentIndex[nodeId] || [];
  };

  // Get parent node for a given nodeId
  this.getParent = function(nodeId) {
    var node = this.nodes[nodeId];
    return this.nodes[node.parent_id];
  };

  // Collect all parent ids of a given node
  this.getParents = function(nodeId) {
    var node = this.get(nodeId);
    var parents = [];
    while (node.parent_id) {
      node = this.getParent(node.id);
      parents.push(node.id);
    }
    return parents;
  };

  // Get root parent
  this.getRootParent = function(nodeId) {
    var node = this.get(nodeId);
    var parent;
    while (node.parent_id) {
      node = this.getParent(node.id);
      if(!node.parent_id) parent = node;
    }
    return parent;
  };

  // Collect all child nodes of a node
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

  // Walk the tree
  this.walkTree = function(fn, ctx) {
    var self = this;
    if (!ctx) ctx = this;

    function _walkTree(rootNode, fn, ctx) {
      if (rootNode !== "root") {
        fn.call(ctx, rootNode);
      }
      each(self.getChildren(rootNode.id || rootNode), function(child) {
        _walkTree(child, fn, ctx);
      });
    }

    return _walkTree("root", fn, ctx);
  };
};

Tree.prototype = new Tree.Prototype();

module.exports = Tree;