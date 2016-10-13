import { Document } from 'substance'
import each from 'lodash/each'
import map from 'lodash/map'
import RubricsIndex from './RubricsIndex'

/*
  Rubrics model.

  Holds all rubrics.
*/

class Rubrics extends Document {
  configurator(schema) {
    super(schema)

    this.addIndex('rubrics', new RubricsIndex(this))
  }
  
  // Get children nodes for a given node
  getChildren(nodeId) {
    let index = this.getIndex('rubrics').index
    let children = index.get(nodeId)

    if(children) {
      return children.rubric
    } else {
      return {}
    }
  }

  // Collect all children nodes of a node
  // returns list of ids
  getAllChildren(nodeId) {
    let childNodes = this.getChildren(nodeId)
    if (childNodes.length === 0) return []
    let allChildren = map(childNodes, 'id')
    each(childNodes, function(childNode) {
      allChildren = allChildren.concat(this.getAllChildren(childNode.id))
    }.bind(this))
    return allChildren
  }

  // Get parent node for a given nodeId
  getParent(nodeId) {
    return this.get(nodeId).getParent()
  }

  // Collect all parents of a given node
  // returns list of ids
  getParents(nodeId) {
    let node = this.get(nodeId)
    let parents = []
    while (node.hasParent()) {
      node = node.getParent()
      parents.push(node.id)
    }
    return parents
  }

  // Get root parent node
  getRootParent(nodeId) {
    return this.get(nodeId).getRoot()
  }

  // Get all root nodes
  getRoots() {
    let index = this.getIndex('rubrics').index
    let roots = []
    each(index, function(node, nodeId) {
      node = this.get(nodeId)
      if(!node.hasParent()) roots.push(node)
    }.bind(this))
    return roots
  }

  // Get ids of all active nodes
  getActive() {
    let active = []
    let rubricNodes = this.getIndex('type').get('rubric')
    each(rubricNodes, function(node) {
      if(node.active) active.push(node.id)
    })
    return active
  }

  // Whatever children of given node has active prop
  hasActiveChildren(nodeId) {
    let result = false
    let children = this.getAllChildren(nodeId)
    each(children, function(childId) {
      let node = this.get(childId)
      if(node.active) {
        result = true
        return false
      }
    }.bind(this))
    return result
  }

  // Get ids of all selected nodes
  getSelected() {
    let selected = []
    let rubricNodes = this.getIndex('type').get('rubric')
    each(rubricNodes, function(node) {
      if(node.selected) selected.push(node.id)
    })
    return selected
  }

  // Whatever children of given node has selected prop
  hasSelectedChildren(nodeId) {
    let result = false
    let children = this.getAllChildren(nodeId)
    each(children, function(childId) {
      let node = this.get(childId)
      if(node.selected) {
        result = true
        return false
      }
    }.bind(this))
    return result
  }

  // Resets selections for all nodes
  resetSelection() {
    let nodes = this.getNodes()
    each(nodes, function(node) {
      if(node.selected) {
        this.set([node.id, 'selected'], false)
      }
    }.bind(this))
  }
}

export default Rubrics
