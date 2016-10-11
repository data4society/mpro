import { Component, DocumentSession } from 'substance/ui/Component'
import extend from 'lodash/extend'

/*
  Editing of Entity
*/
class EditEntity extends Component {

  didMount() {
    this._loadEntity()
  }

  dispose() {
    let doc = this.state.doc
    if(doc) {
      doc.off(this)
    }
  }

  render($$) {
    let doc = this.state.doc
    let entity = this.state.entity
    let controller = this.context.controller
    let componentRegistry = controller.props.configurator.getComponentRegistry()
    let Form = componentRegistry.get('form')

    let el = $$('div').addClass('sc-entity-editor')

    if(entity && doc) {
      let entityData = doc.get(entity.entity_class)
      let form = $$(Form, {node: entityData, session: this.state.session})

      el.append(form)
    } else {
      el.append('There is no handler for this entity class, sorry')
    }

    return el
  }

  _loadEntity() {
    let entityId = this.props.entityId
    let mproConfigurator = this.context.configurator
    let configurator = mproConfigurator.getConfigurator('mpro-entities')
    let documentClient = this.context.documentClient

    documentClient.getEntity(entityId, function(err, entity) {
      if(err) {
        console.error(err)
        this.setState({
          error: new Error('Entity loading failed')
        })
        return
      }

      let entityClass = entity.entity_class
      let container = configurator.createArticle()

      if(container.schema.getNodeClass(this.props.node.entityClass)) {
        let entityData = {
          id: entityClass,
          type: entityClass
        }

        entityData = extend(entityData, entity.data)
        container.create(entityData)

        container.on('document:changed', this._onDocumentChanged, this)

        let session = new DocumentSession(container)

        this.setState({
          doc: container,
          session: session,
          entity: entity
        })
      }
    }.bind(this))
  }

  _updateEntity(data, name) {
    let entityId = this.props.entityId
    let documentClient = this.context.documentClient
    let entityData = {
      data: data.toJSON(),
      name: name
    }
    // Remove node props
    delete entityData.data.id
    delete entityData.data.type

    documentClient.updateEntity(entityId, entityData, function(err) {
      if(err) {
        console.error(err);
        this.setState({
          error: new Error('Entity update failed')
        })
        return
      }
    }.bind(this))
  }

  _onDocumentChanged() {
    let doc = this.state.doc
    let entity = this.state.entity
    let entityData = doc.get(entity.entity_class)
    let name = entityData.getName()
    this._updateEntity(entityData, name)
  }
}

export default EditEntity
