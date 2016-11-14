import { Component, Input } from 'substance'
import RulesEditor from './RulesEditor'

class CollectionsEditor extends Component {

  getInitialState() {
    return {
      name: this.props.name,
      description: this.props.description
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
      .on('change', this._commit)
      .ref('nameInput')
    )

    let descriptionInput = $$('div').addClass('se-collection-description').append(
      $$('textarea').addClass('sc-textarea').attr({
        placeholder: this.getLabel('collection-description-placeholder')
      })
      .append(this.state.description)
      .on('change', this._commit)
      .ref('descriptionInput')
    )

    el.append(
      nameInput,
      descriptionInput,
      $$(RulesEditor, {collectionId: this.props.collection_id})
    )

    return el
  }

  _commit() {
    this.setState({
      name: this.refs['nameInput'].val(),
      description: this.refs['descriptionInput'].val()
    })
  }
}

export default CollectionsEditor
