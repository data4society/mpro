import { Component } from 'substance'
import each from 'lodash/each'
import isEmpty from 'lodash/isEmpty'
import EntitySelector from './EntitySelector'

class EntityFacets extends Component {
  getInitialState() {
    return {
      entityEditor: false
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-facets sc-entity-facets')
    let entities = this.props.entities

    if(this.state.entityEditor !== false) {
      el.append(
        $$(EntitySelector, {entities: entities}).ref('editor')
      )
    }

    el.append(
      $$('div').addClass('se-tree-node se-tree-title').append(
        $$('span').addClass('se-tree-node-name').append('Entities'),
        $$('span').addClass('se-actions').append(
          this.context.iconProvider.renderIcon($$, 'facets-load')
            .on('click', this._loadFacets),
          this.context.iconProvider.renderIcon($$, 'facets-save')
            .on('click', this._saveFacets),
          this.context.iconProvider.renderIcon($$, 'facets-edit')
            .on('click', this._addFacet)
        )
      )
    )

    if(!isEmpty(entities)) {
      each(entities, entity => {
        let item = $$('div').addClass('se-tree-node').append(
          $$('span').addClass('se-tree-node-name').append(entity.name),
          $$('span').addClass('se-tree-node-counter').append(entity.count)
        ).on('click', this._toggleFacet.bind(this, entity.entity_id))

        if(entity.active) {
          item.addClass('active')
        }

        el.append(item)
      })
    }

    return el
  }

  _toggleFacet(entityId) {
    this.send('toggleEntityFacet', entityId)
  }

  _addFacet() {
    this.extendState({entityEditor: true})
  }

  _loadFacets() {
    this.send('loadEntityFacets')
  }

  _saveFacets() {
    this.send('saveEntityFacets')
  }

  _onCloseEntitySelector() {

  }
}

export default EntityFacets
