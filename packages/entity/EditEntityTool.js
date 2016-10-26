import { Tool } from 'substance'
import clone from 'lodash/clone'

/*
  Edit an entity reference in a prompt.
*/
class EditEntityTool extends Tool {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'closeModal': this._doneEditing,
      'doneEditing': this._doneEditing
    })
  }
  
  render($$) {
    let Modal = this.getComponent('modal')
    let Button = this.getComponent('button')
    let EntityEditor = this.getComponent('entity-editor')

    let node = this.props.node
    let el = $$('div').addClass('sc-edit-entity-tool')

    el.append(
      $$('div').addClass('se-label').append(node.entityClass),
      $$(Button, {
        icon: 'edit',
        style: this.props.style
      })
      .attr('title', this.getLabel('edit-entity'))
      .on('click', this._onEdit),
      $$(Button, {
        icon: 'delete',
        style: this.props.style
      })
      .attr('title', this.getLabel('delete-ref'))
      .on('click', this._onDelete)
    )

    if (this.state.edit) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EntityEditor, {entityId: node.reference, node: node})
        )
      )
    }
    return el
  }

  _onEdit() {
    this.setState({
      edit: true
    })
  }

  _doneEditing() {
    this.setState({
      edit: false
    })
  }


  _onDelete(e) {
    e.preventDefault()
    let node = this.props.node
    let sm = this.context.surfaceManager
    let surface = sm.getFocusedSurface()
    surface.transaction(function(tx, args) {
      tx.delete(node.id)
      return args
    })
  }
}

EditEntityTool.getProps = function(commandStates) {
  if (commandStates.entity.mode === 'edit') {
    return clone(commandStates.entity)
  } else {
    return undefined
  }
}

EditEntityTool.type = 'edit-entity'

export default EditEntityTool
