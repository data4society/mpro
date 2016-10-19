import { AnnotationCommand, createAnnotation } from 'substance'
import extend from 'lodash/extend'

class EntityCommand extends AnnotationCommand {
  canFuse() { return false }

  canDelete() { return false }

  getCommandState(params) { // eslint-disable-line

    let sel = this._getSelection(params)
    // We can skip all checking if a disabled condition is met
    // E.g. we don't allow toggling of property annotations when current
    // selection is a container selection
    if (this.isDisabled(sel)) {
      return {
        disabled: true
      }
    }

    let annos = this._getAnnotationsForSelection(params)
    
    // Check if current anno have the same entity class, 
    // if so make tool active
    let anno = annos[0]

    if(anno) {
      if(anno.entityClass !== this.config.name) {
        return {
          disabled: true
        }
      }
    }

    let newState = {
      disabled: false,
      active: false,
      mode: null
    }
    if (this.canCreate(annos, sel)) {
      newState.mode = 'create'
    } else if (this.canFuse(annos, sel)) {
      newState.mode = 'fuse'
    } else if (this.canTruncate(annos, sel)) {
      newState.active = true
      newState.mode = 'truncate'
    } else if (this.canExpand(annos, sel)) {
      newState.mode = 'expand'
    } else if (this.canDelete(annos, sel)) {
      newState.active = true
      newState.mode = 'delete'
    } else {
      newState.disabled = true
    }
    return newState
  }

  executeCreate(params) {
    let annos = this._getAnnotationsForSelection(params)
    this._checkPrecondition(params, annos, this.canCreate)
    let newAnno = this._applyTransform(params, function(tx) {
      let node = extend({}, this.getAnnotationData(), params.node)
      node.type = this.getAnnotationType()
      return createAnnotation(tx, {
        node: node,
        selection: params.selection
      })
    }.bind(this))
    return {
      mode: 'create',
      anno: newAnno
    }
  }
}

export default EntityCommand
