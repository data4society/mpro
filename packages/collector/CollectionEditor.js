import { Button, Component, Input, uuid } from 'substance'

class CollectionsEditor extends Component {

  getInitialState() {
    let controller = this.context.controller
    return {
      name: 'New collection title',
      description: 'Describe your collection',
      public: false,
      private: true,
      app_id: controller.props.app
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-collection-editor')

    let nameInput = $$('div').addClass('se-collection-name').append(
      $$(Input, {
        type: 'text',
        placeholder: this.getLabel('collection-name-placeholder'),
        centered: true,
        value: this.state.name
      })
      .on('keyup', this._commit)
      .ref('nameInput')
    )

    let descriptionInput = $$('div').addClass('se-collection-description').append(
      $$('textarea').addClass('sc-textarea').attr({
        placeholder: this.getLabel('collection-description-placeholder')
      })
      .append(this.state.description)
      .on('keyup', this._commit)
      .ref('descriptionInput')
    )

    let saveCollection = $$(Button, {label: 'collector-save-new', style: 'default'})
      .addClass('se-collection-save')
      .on('click', this._saveCollection)

    el.append(
      nameInput,
      descriptionInput,
      saveCollection
    )

    return el
  }

  _commit() {
    this.extendState({
      name: this.refs['nameInput'].val(),
      description: this.refs['descriptionInput'].val()
    })
  }

  _saveCollection() {
    let authClient = this.context.authenticationClient
    let user = authClient.getUser()
    let dataClient = this.context.documentClient
    let collection = {
      collection_id: uuid(),
      name: this.state.name,
      description: this.state.description,
      author: user.user_id,
      private: this.state.private,
      public: this.state.public,
      app_id: this.state.app_id
    }

    dataClient.createCollection(collection, function(err, col) {
      if (err) {
        console.error(err)
        return
      }

      this.send('saveCollection', col)
    }.bind(this))
  }
}

export default CollectionsEditor
