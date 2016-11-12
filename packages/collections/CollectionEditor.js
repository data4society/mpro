import { Component, Input } from 'substance'

class CollectionsEditor extends Component {
  render($$) {
    let el = $$('div').addClass('sc-collection-editor')

    let nameInput = $$('div').addClass('se-collection-name').append(
      $$(Input, {
        type: 'text',
        placeholder: this.getLabel('collection-name-placeholder'),
        centered: true,
        value: this.props.name
      })
      .ref('nameInput')
    )

    let descriptionInput = $$('div').addClass('se-collection-description').append(
      $$('textarea').addClass('sc-textarea').attr({
        placeholder: this.getLabel('collection-description-placeholder')
      })
      .ref('descriptionInput')
      .append(this.props.description)
    )

    el.append(
      nameInput,
      descriptionInput
    )

    return el
  }
}

export default CollectionsEditor
