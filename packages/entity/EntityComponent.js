import { AnnotationComponent } from 'substance'

class EntityComponent extends AnnotationComponent {

  getClassNames() {
    let entityClass = this.props.node.entityClass
    let classNames = 'sc-'+this.props.node.type

    if(entityClass) {
      classNames += ' sc-entity-' + entityClass
    }

    return classNames
  }
}

export default EntityComponent
