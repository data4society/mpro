import { Component, Input } from 'substance'
import RulesEditor from './RulesEditor'

class CollectionsEditor extends Component {

  getInitialState() {
    return {
      name: this.props.name,
      description: this.props.description,
      public: this.props.public,
      private: this.props.private,
      accepted: this.props.accepted
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

    let isPrivate = this.state.private
    let selectedIcon = isPrivate ? 'checked' : 'unchecked'
    let isPrivateInput = $$('div').addClass('se-collection-private sc-button sm-style-default').append(
      'Private collection',
      this.context.iconProvider.renderIcon($$, selectedIcon).addClass('selection')
    ).on('click', this._switchPrivate)
    if(isPrivate) isPrivateInput.addClass('sm-selected')

    let isPublic = this.state.public
    selectedIcon = isPublic ? 'checked' : 'unchecked'
    let isPublicInput = $$('div').addClass('se-collection-public sc-button sm-style-default').append(
      'Public collection',
      this.context.iconProvider.renderIcon($$, selectedIcon).addClass('selection')
    ).on('click', this._switchPublic)
    if(isPublic) isPublicInput.addClass('sm-selected')

    let isAccepted = this.state.accepted
    selectedIcon = isAccepted ? 'checked' : 'unchecked'
    let isAcceptedInput = $$('div').addClass('se-collection-accepted sc-button sm-style-default').append(
      'Accepted data',
      this.context.iconProvider.renderIcon($$, selectedIcon).addClass('selection')
    ).on('click', this._switchAccepted)
    if(isAccepted) isAcceptedInput.addClass('sm-selected')


    el.append(
      nameInput,
      descriptionInput,
      $$('div').addClass('se-collection-options').append(
        isPublicInput,
        isPrivateInput,
        isAcceptedInput
      )
    )

    if(!isPrivate) {
      el.append(
        $$(RulesEditor, {collectionId: this.props.collection_id, app: this.props.app_id})
      )
    }

    return el
  }

  _switchPrivate() {
    this.extendState({
      private: !this.state.private
    })
  }

  _switchPublic() {
    this.extendState({
      public: !this.state.public
    })
  }

  _switchAccepted() {
    this.extendState({
      accepted: !this.state.accepted
    })
  }

  _commit() {
    this.extendState({
      name: this.refs['nameInput'].val(),
      description: this.refs['descriptionInput'].val()
    })
  }
}

export default CollectionsEditor
