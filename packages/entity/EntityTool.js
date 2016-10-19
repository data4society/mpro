import { AnnotationTool, Modal } from 'substance'
import EntityFinder from './EntityFinder'

class EntityTool extends AnnotationTool {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'closeModal': this._onModalClose,
      'createReference': this._createReference
    })
  }

  render($$) {
    let el = $$('div')
      .addClass('se-tool sm-annotation-tool')

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
    
    if(this.state.showModal && this.props.mode === 'create') {

      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EntityFinder, {
            entityClass: this.getEntityClass()
          }).ref('selector')
        )
      )
    }

    return el
  }

  getClassNames() {
    return 'se-tool-' + this.getName()
  }

  onClick(e) {
    e.preventDefault()
    e.stopPropagation()
    let showModal = this.state.showModal
    this.setState({showModal: !showModal})
    if (!this.props.disabled && this.props.mode !== 'create') this.executeCommand()
  }

  _onModalClose() {
    let showModal = this.state.showModal
    this.setState({showModal: !showModal})
  }

  _createReference(ref, newEntity) {
    let showModal = this.state.showModal
    let commandManager = this.context.commandManager
    this.setState({showModal: !showModal, reference: ref})
    if (!this.props.disabled && !this.state.showModal) {
      if(newEntity) commandManager['create-entity'] = true
      let props = {
        node: {
          entityClass: this.getEntityClass(),
          reference: this.state.reference
        }
      }
      this.executeCommand(props)
    }
  }

  getEntityClass() {
    return this.getName()
  }
}

export default EntityTool
