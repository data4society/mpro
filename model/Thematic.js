var Tree = require('./tree');
var each = require('lodash/each');
var uniq = require('lodash/uniq');
var map = require('lodash/map');
var clone = require('lodash/clone');
var includes = require('lodash/includes');

var Thematic = function(doc, thematics) {
  this.doc = doc;
  
  // Convert thematics to hash
  this.thematics = {};

  each(thematics, function(thematic) {
    this.thematics[thematic.thematic_id] = thematic;
    if (doc) {
      var references = doc.thematicReferencesIndex.get(thematic.thematic_id);
      this.thematics[thematic.thematic_id].references = map(references, 'thematic_id');      
    }
  }.bind(this));
  
  this.tree = new Tree(this.thematics);
};

Thematic.prototype.get = function(thematicId) {
  return this.thematics[thematicId];
};

Thematic.prototype.getNestedTree = function() {
  var tree = this.tree;

  function getChildren(parentId) {
    var res = [];
    var nodes = tree.getChildren(parentId);
    if (nodes.length === 0) return res; // exit condition

    each(nodes, function(node) {
      var entry = {
        id: node.thematic_id,
        text: node.title,
        children: getChildren(node.thematic_id) // get children for thematic
      };
      res.push(entry);
    });
    return res;
  }

  return getChildren("root");
};


Thematic.prototype.getAllReferencedThematics = function() {
  var doc = this.doc;
  var thematicRefs = doc.thematicReferencesIndex.get();
  var thematics = [];

  each(thematicRefs, function(thematicRef) {
    each(thematicRef.target, function(thematicId) {
      var thematic = this.tree.get(thematicId);
      if (!includes(thematics, thematic)) {
        if(thematic === undefined) {
          console.log('You have outdated thematics in this document');
        } else {
          thematics.push(thematic);
        }
      }
    }, this);
  }, this);

  return thematics;
};


Thematic.prototype.getTree = function() {
  return this.tree;
};

Thematic.prototype.getReferencedThematicsTree = function() {
  var referencedThematics = this.getAllReferencedThematicsWithParents();
  var filteredModel = new Thematic(this.doc, referencedThematics);
  return filteredModel.tree;
};

Thematic.prototype.getFullPathForThematic = function(thematicId) {
  var tree = this.tree;
  var res = [];

  function getParent(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) getParent(parent.id);

    res.push(node.name);
    return res;
  }
  return getParent(thematicId);
};
  
// Used in state_handlers.js
Thematic.prototype.getReferencesForThematic = function(thematicId) {
  var tree = this.getReferencedThematicsTree();
  var relevantThematics = tree.getAllChildren(thematicId).concat(thematicId);
  var doc = this.doc;
  var references = [];

  each(relevantThematics, function(thematicId) {
    references = references.concat(Object.keys(doc.thematicReferencesIndex.get(thematicId)));
  });

  return uniq(references);
};

Thematic.prototype.getAllReferencedThematicsWithParents = function() {
  var referencedThematics = this.getAllReferencedThematics();
  var thematics = clone(referencedThematics);
  var tree = this.tree;
  
  each(referencedThematics, function(thematic) {
    collectParents(thematic.thematic_id);
  });

  function collectParents(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) collectParents(parent.thematic_id);

    thematics.push(node);
    return;
  }

  thematics = uniq(thematics);
  
  return thematics;
};

module.exports = Thematic;