import { Component } from 'substance'
import map from 'lodash/map'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import flattenDeep from 'lodash/flattenDeep'

class Facets extends Component {

  render($$) {
    let el = $$('div').addClass('sc-facets')
    let rubrics = this.props.rubrics
    if(!isEmpty(rubrics)) {
      let childNodes = rubrics.getRoots()

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))
      
      el.append(flattenDeep(childEls))
    }

    return el
  }

  renderChildren($$, node, level) {
    let rubrics = this.props.rubrics
    let isSelected = node.active
    let hasSelectedChildren = rubrics.hasActiveChildren(node.id)
    let isExpanded = node.expanded || isSelected || hasSelectedChildren
    let childNodes = rubrics.getChildren(node.id)
    let hideExpand = isEmpty(childNodes)
    let childrenEls = []

    if(level === 1) {
      isExpanded = true
      hideExpand = true
    }

    if(isExpanded) {
      childrenEls = map(childNodes, function(сhildNode) {
        return this.renderChildren($$, сhildNode, level + 1)
      }.bind(this))
    }

    let el = $$('div').addClass('se-tree-node').ref(node.id)

    if(isSelected) el.addClass('active')

    // level graphical nesting
    if(hideExpand && level !== 1) {
      level = level * 2
      if(level === 4) level = 5
    }
    let levelSign = new Array(level).join('·') + ' '
    el.append(levelSign)

    if(!hideExpand) {
      let expandedIcon = isExpanded ? 'expanded' : 'collapsed'
      el.append(
        this.context.iconProvider.renderIcon($$, expandedIcon).addClass('expansion')
          .on('click', this._expandNode.bind(this, node.id))
      )
    }

    if(level === 1) {
      el.addClass('se-tree-title')
      el.append($$('span').addClass('se-tree-node-name').append('Rubrics (' + node.name + ')'))
    } else {
      el.on('click', this._toggleFacet.bind(this, node.id))
      el.append($$('span').addClass('se-tree-node-name').append(node.name))
      el.append($$('span').addClass('se-tree-node-counter').append(node.count))
    }

    return concat(el, childrenEls)
  }

  _expandNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let rubrics = this.props.rubrics
    let isExpanded = rubrics.get([id, 'expanded'])
    rubrics.set([id, 'expanded'], !isExpanded);
    this.extendProps({
      rubrics: rubrics
    })
  }

  _toggleFacet(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let rubrics = this.props.rubrics
    let currentValue = rubrics.get([id, 'active'])
    rubrics.set([id, 'active'], !currentValue)
    this.extendProps({
      rubrics: rubrics
    })
  }

}

export default Facets
