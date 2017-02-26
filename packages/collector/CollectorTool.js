import { Modal, Tool } from 'substance'
import extend from 'lodash/extend'
import CollectionEditor from './CollectionEditor'
import CollectionSelector from './CollectionSelector'

/*
  Edit set of rubrics attached to the document.
*/

class CollectorTool extends Tool {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'listChanged': this._onListChanged,
      'addCollection': this._showCollectionModal,
      'saveCollection': this._saveCollection,
      'closeModal': this._onModalClose
    })
  }

  getInitialState() {
    let doc = this.context.doc
    let collectionsMeta = doc.get(['meta','collections'])
    return {
      openDropDown: false,
      showModal: false,
      selected: collectionsMeta
    }
  }

  render($$) {
    let el = $$('div')
      .addClass('se-tool')

    let customClassNames = this.getClassNames()
    if (customClassNames) {
      el.addClass(customClassNames)
    }

    let title = this.getTitle()
    if (title) {
      el.attr('title', title)
      el.attr('aria-label', title)
    }
    //.sm-disabled
    if (this.props.disabled) {
      el.addClass('sm-disabled')
    }
    // .sm-active
    if (this.props.active) {
      el.addClass('sm-active')
    }

    // button
    el.append(this.renderButton($$))
    
    if(this.state.openDropDown) {
      el.append(
        $$('div').addClass('sc-tool-dropdown').append(
          $$(CollectionSelector, {
            collections: this.state.selected
          }).addClass('se-options').ref('selector')
        )
      )
    }

    if(this.state.showModal) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(CollectionEditor).ref('editor')
        )
      )
    }

    return el
  }

  onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    let openDropDown = this.state.openDropDown
    if(openDropDown) {
      this.performAction(this.state.selected)
      this.extendProps({icon: 'collector'})
    } else {
      this.extendProps({icon: 'collector-active'})
    }
    this.extendState({openDropDown: !openDropDown, showModal: false})
  }

  _onListChanged(collections) {
    this.extendState({selected: collections})
  }

  _showCollectionModal() {
    this.extendState({showModal: true})
  }

  _saveCollection(col) {
    let collections = this.state.selected
    collections.unshift(col.collection_id)
    this.extendState({selected: collections, showModal: false})
    let selector = this.refs.selector
    let list = selector.state.list
    list.unshift(col)
    let total = parseInt(selector.state.totalItems, 10) + 1
    selector.extendState({list: list, totalItems: total, selected: collections})
  }

  _onModalClose() {
    let showModal = this.state.showModal
    this.extendState({showModal: !showModal})
  }

  performAction(collections) {
    this.context.commandManager.executeCommand(this.getCommandName(), {
      collections: collections
    })
  }
}

export default CollectorTool
