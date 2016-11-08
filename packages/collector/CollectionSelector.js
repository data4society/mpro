import { Component } from 'substance'
import map from 'lodash/map'
import each from 'lodash/each'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'

class CollectionSelector extends Component {

  getInitialState() {
    return {
      list: [],
      selected: this.props.collections
    }
  }

  didMount() {
    this._loadCollection()
  }

  render($$) {
    let el = $$('div').addClass('sc-collector')
    let selected = this.state.selected
    let collections = this.state.list 
    
    if(!isEmpty(collections)) {
      each(collections, function(col) {
        let isSelected = selected.indexOf(col.collection_id) > -1
        let node = $$('div').addClass('se-collection-node').ref(col.collection_id)
        let selectedIcon = isSelected ? 'checked' : 'unchecked'
        if(isSelected) node.addClass('sm-selected')
        node.append(
          this.context.iconProvider.renderIcon($$, selectedIcon).addClass('sm-selection')
            .on('click', this._selectNode.bind(this, col.collection_id)),
          $$('span').addClass('se-collection-node-name').append(col.name),
          $$('span').addClass('se-collection-node-description').append(col.description)
        )
        el.append(node)
      }.bind(this))

    }

    return el
  }

  _selectNode(id, e) {
    e.preventDefault()
    e.stopPropagation()
    let selected = this.state.selected
    let isSelected = selected.indexOf(id) > -1
    if(isSelected) {
      selected.splice(selected.indexOf(id), 1)
    } else {
      selected.push(id)
    }
    this.extendProps({
      selected: selected
    })
    this.send('listChanged', selected)
  }

  _loadCollection() {
    let dataClient = this.context.documentClient
    dataClient.listCollections({}, {}, function(err, collections) {
      if (err) {
        console.error(err)
        return
      }
      
      this.extendState({list: collections.records})
    }.bind(this))
  }
}

export default CollectionSelector
