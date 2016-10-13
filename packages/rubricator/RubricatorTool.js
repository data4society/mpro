import { Modal, Tool } from 'substance/'
import extend from 'lodash/extend'
import each from 'lodash/each'
import RubricSelector from './RubricSelector'

/*
  Edit set of rubrics attached to the document.
*/

class RubricatorTool extends Tool {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'closeModal': this._onModalClose
    })
  }

  getInitialState() {
    return {
      showModal: false
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
    
    if(this.state.showModal) {
      let doc = this.context.doc;
      let rubricsMeta = doc.get(['meta','rubrics'])
      let rubrics = this.context.controller.props.rubrics

      rubrics.resetSelection()

      each(rubricsMeta, function(id){
        rubrics.set([id, 'selected'], true)
      })

      el.append(
        $$(Modal, {
          width: 'large'
        }).append(
          $$(RubricSelector, {
            rubrics: this.context.controller.props.rubrics
          }).ref('selector')
        )
      )
    }

    return el
  }

  onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    let showModal = this.state.showModal
    this.setState({showModal: !showModal})
  }

  _onModalClose() {
    let showModal = this.state.showModal
    this.setState({showModal: !showModal})
    if (!this.props.disabled && !this.state.showModal) this.performAction()
  }

  performAction(props) {
    let rubrics = this.context.controller.props.rubrics
    this.context.commandManager.executeCommand(this.getCommandName(), extend({
      mode: this.props.mode,
      rubrics: rubrics.getSelected()
    }, props))
  }
}

export default RubricatorTool
