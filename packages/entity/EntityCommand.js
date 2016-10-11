import { AnnotationCommand, createAnnotation } from 'substance'

class EntityCommand extends AnnotationCommand {

  canEdit(annos, sel) { // eslint-disable-line
    return annos.length === 1
  }

  executeCreate(props, context) {
    let annos = this._getAnnotationsForSelection(props, context)
    this._checkPrecondition(props, context, annos, this.canCreate)
    let newAnno = this._applyTransform(props, context, function(tx) {
      props.node.type = this.getAnnotationType()
      return createAnnotation(tx, props)
    }.bind(this))
    return {
      mode: 'edit',
      anno: newAnno
    }
  }

  getAnnotationType() {
    return 'entity'
  }
}

export default EntityCommand
