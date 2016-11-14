import { Component } from 'substance'
import map from 'lodash/map'
import each from 'lodash/each'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import flattenDeep from 'lodash/flattenDeep'

class RubricSelector extends Component {

  didMount() {
    this._loadRubrics()
  }

  render($$) {
    let el = $$('div').addClass('sc-modal sm-width-medium')
    let rubricatorEl = $$('div').addClass('se-body sc-rubricator')
    let rubrics = this.state.rubrics

    if(!isEmpty(rubrics)) {
      let childNodes = rubrics.getRoots()

      let childEls = childNodes.map(function(node) {
        return this.renderChildren($$, node, 1)
      }.bind(this))
      
      rubricatorEl.append(flattenDeep(childEls))
    }

    el.on('click', this._closeModal)
    el.append(rubricatorEl)

    return el
  }

  renderChildren($$, node, level) {

    let rubrics = this.state.rubrics
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
    let rubrics = this.state.rubrics
    let show = rubrics.get([id, 'help'])
    rubrics.set([id, 'help'], !show)
    this.extendState({
      rubrics: rubrics
    })
  }

  _expandNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let rubrics = this.state.rubrics
    let isExpanded = rubrics.get([id, 'expanded'])
    rubrics.set([id, 'expanded'], !isExpanded)
    this.extendState({
      rubrics: rubrics
    })
  }

  _selectNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let rubrics = this.state.rubrics
    let isSelected = rubrics.get([id, 'selected'])
    rubrics.set([id, 'selected'], !isSelected)
    this.extendState({
      rubrics: rubrics
    })
  }

  _loadRubrics() {
    let documentClient = this.context.documentClient

    documentClient.listRubrics({}, {limit: 300}, function(err, result) {
      if (err) {
        console.error(err)
        this.setState({
          error: new Error('Rubrics loading failed')
        })
        return
      }
      
      let configurator = this.context.configurator
      let importer = configurator.createImporter('rubrics')
      let rubrics = importer.importDocument(result, [])

      rubrics.resetSelection()

      each(this.props.rubrics, function(id){
        rubrics.set([id, 'selected'], true)
      })


      this.extendState({
        rubrics: rubrics
      })
    }.bind(this))
  }

  _closeModal(e) {
    e.stopPropagation()
    let closeSurfaceClick = e.target.classList.contains('sc-modal')
    if (closeSurfaceClick) {
      let selected = {
        id: this.state.rubrics.getSelected(),
        names: []
      }
      selected.id.forEach(function(id) {
        selected.names.push(this.state.rubrics.get([id, 'name']))
      }.bind(this))
      this.send('closeRubricSelector', selected)
    }
  }
}

export default RubricSelector
