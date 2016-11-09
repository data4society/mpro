import { Tool } from 'substance'
import extend from 'lodash/extend'
import CollectionSelector from './CollectionSelector'

/*
  Edit set of rubrics attached to the document.
*/

class CollectorTool extends Tool {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'listChanged': this._onListChanged
    })
  }

  getInitialState() {
    let doc = this.context.doc
    let collectionsMeta = doc.get(['meta','collections'])
    return {
      openDropDown: false,
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
    this.extendState({openDropDown: !openDropDown})
  }

  _onListChanged(collections) {
    this.extendState({selected: collections})
  }

  performAction(collections) {
    this.context.commandManager.executeCommand(this.getCommandName(), {
      collections: collections
    })
  }
}

export default CollectorTool
