import { Component } from 'substance'
import map from 'lodash/map'
import each from 'lodash/each'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import flattenDeep from 'lodash/flattenDeep'

class CollectionSelector extends Component {

  render($$) {
    let el = $$('div').addClass('sc-collector')
    let collections = this.state.collections

    if(!isEmpty(rubrics)) {
      let childNodes = rubrics.getRoots()

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))
      
      el.append(flattenDeep(childEls))
    }

    return el
  }

  renderItem($$, node, level) {

    let rubrics = this.props.rubrics
    let isSelected = node.selected
    let hasSelectedChildren = rubrics.hasSelectedChildren(node.id)
    let isExpanded = node.expanded || isSelected || hasSelectedChildren
    let childNodes = rubrics.getChildren(node.id)
    let hideExpand = isEmpty(childNodes)
    let childrenEls = []

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1)
      }.bind(this))
    }

    let el = $$('div').addClass('se-tree-node').ref(node.id)
      .on('click', this._expandNode.bind(this, node.id))

    el.addClass('level-' + level)

    if(!hideExpand) {
      let expandedIcon = isExpanded ? 'expanded' : 'collapsed'
      el.append(
        this.context.iconProvider.renderIcon($$, expandedIcon).addClass('expansion')
      )
    }

    if(level !== 1) {
      let selectedIcon = isSelected ? 'checked' : 'unchecked'
      if(isSelected) el.addClass('sm-selected')
      el.append(
        this.context.iconProvider.renderIcon($$, selectedIcon).addClass('selection')
          .on('click', this._selectNode.bind(this, node.id))
      )
    }

    el.append($$('span').addClass('se-tree-node-name').append(node.name))

    if(node.description) {
      let helpIcon = node.help ? 'helper-on' : 'helper-off'

      el.append(
        this.context.iconProvider.renderIcon($$, helpIcon).addClass('help')
          .on('click', this._toggleHelp.bind(this, node.id))
      )
      if(node.help) {
        el.append($$('div').addClass('se-node-help').append(node.description))
      }
    }

    return concat(el, childrenEls);
  }

  _toggleHelp(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let rubrics = this.props.rubrics
    let show = rubrics.get([id, 'help'])
    rubrics.set([id, 'help'], !show)
    this.extendProps({
      rubrics: rubrics
    })
  }

  _selectNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let rubrics = this.props.rubrics
    let isSelected = rubrics.get([id, 'selected'])
    rubrics.set([id, 'selected'], !isSelected)
    if(isSelected) {
      // Unselect all children
      let children = rubrics.getAllChildren(id)
      each(children, function(node_id) {
        rubrics.set([node_id, 'selected'], !isSelected)
      })
    } else {
      // Select all parents except root
      let parents = rubrics.getParents(id)
      each(parents, function(node_id) {
        if(rubrics.get(node_id).hasParent()) {
          rubrics.set([node_id, 'selected'], !isSelected)
        }
      })
    }
    this.extendProps({
      collections: collections
    })
  }
}

export default CollectionSelector
