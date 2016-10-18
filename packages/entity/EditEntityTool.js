import { Component, Modal, Prompt } from 'substance'
import clone from 'lodash/clone'
import EditEntity from './EditEntity'

/*
  Edit an entity reference in a prompt.
*/
class EditEntityTool extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'closeModal': this._doneEditing,
      'doneEditing': this._doneEditing
    })
  }

  willReceiveProps() {
    if(this.context.commandManager['create-entity'] === true) {
      this.setState({
        edit: true
      })
      this.context.commandManager['create-entity'] = false
    }
  }

  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-edit-entity-tool')

    el.append(
      $$(Prompt).append(
        $$(Prompt.Label, {label: node.entityClass}),
        $$(Prompt.Separator),
        $$(Prompt.Action, {name: 'edit', title: this.getLabel('edit-entity')})
          .on('click', this._onEdit),
        $$(Prompt.Action, {name: 'delete', title: this.getLabel('delete-ref')})
          .on('click', this._onDelete)
      )
    )

    if (this.state.edit) {
      el.append(
        $$(Modal, {
          width: 'middle'
        }).append(
          $$(EditEntity, {entityId: node.reference, node: node})
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
