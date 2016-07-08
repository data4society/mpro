var Tree = require('../tree/Tree');
var each = require('lodash/each');
var uniq = require('lodash/uniq');
var map = require('lodash/map');
var clone = require('lodash/clone');
var includes = require('lodash/includes');

var Rubric = function(doc, rubrics) {
  this.doc = doc;
  
  // Convert rubrics to hash
  this.rubrics = {};

  each(rubrics, function(rubric) {
    rubric.id = rubric.rubric_id;
    this.rubrics[rubric.rubric_id] = rubric;
    if (doc) {
      var references = doc.rubricReferencesIndex.get(rubric.rubric_id);
      this.rubrics[rubric.rubric_id].references = map(references, 'rubric_id');      
    }
  }.bind(this));
  
  this.tree = new Tree(this.rubrics);
};

Rubric.prototype.get = function(rubricId) {
  return this.rubrics[rubricId];
};

Rubric.prototype.getNestedTree = function() {
  var tree = this.tree;

  function getChildren(parentId) {
    var res = [];
    var nodes = tree.getChildren(parentId);
    if (nodes.length === 0) return res; // exit condition

    each(nodes, function(node) {
      var entry = {
        id: node.rubric_id,
        text: node.name,
        children: getChildren(node.rubric_id) // get children for rubric
      };
      res.push(entry);
    });
    return res;
  }

  return getChildren("root");
};

Rubric.prototype.getAllReferencedRubrics = function() {
  var doc = this.doc;
  var rubricRefs = doc.rubricReferencesIndex.get();
  var rubrics = [];

  each(rubricRefs, function(rubricRef) {
    each(rubricRef.target, function(rubricId) {
      var rubric = this.tree.get(rubricId);
      if (!includes(rubrics, rubric)) {
        if(rubric === undefined) {
          console.log('You have outdated rubrics in this document');
        } else {
          rubrics.push(rubric);
        }
      }
    }, this);
  }, this);

  return rubrics;
};

Rubric.prototype.getTree = function() {
  return this.tree;
};

Rubric.prototype.getReferencedRubricsTree = function() {
  var referencedrubrics = this.getAllReferencedRubricsWithParents();
  var filteredModel = new Rubric(this.doc, referencedRubrics);
  return filteredModel.tree;
};

Rubric.prototype.getFullPathForRubric = function(rubricId) {
  var tree = this.tree;
  var res = [];

  function getParent(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) getParent(parent.id);

    res.push(node.name);
    return res;
  }
  return getParent(rubricId);
};
  
// Used in state_handlers.js
Rubric.prototype.getReferencesForRubric = function(rubricId) {
  var tree = this.getReferencedRubricsTree();
  var relevantrubrics = tree.getAllChildren(rubricId).concat(rubricId);
  var doc = this.doc;
  var references = [];

  each(relevantrubrics, function(rubricId) {
    references = references.concat(Object.keys(doc.rubricReferencesIndex.get(rubricId)));
  });

  return uniq(references);
};

Rubric.prototype.getAllReferencedRubricsWithParents = function() {
  var referencedrubrics = this.getAllReferencedRubrics();
  var rubrics = clone(referencedrubrics);
  var tree = this.tree;
  
  each(referencedrubrics, function(rubric) {
    collectParents(rubric.rubric_id);
  });

  function collectParents(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) collectParents(parent.rubric_id);

    rubrics.push(node);
    return;
  }

  rubrics = uniq(rubrics);
  
  return rubrics;
};

module.exports = Rubric;