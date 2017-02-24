import { Component } from 'substance'

class CollectionItem extends Component {

  render($$) {
    let col = this.props.collection
    let el = $$('div').addClass('se-collection-item')
      .ref(col.collection_id)

    if(this.props.active) {
      el.addClass('sm-selected')
    } else {
      el.on('click', this._selectCollection.bind(this, col.collection_id))
    }
    el.append(
      $$('span').addClass('se-collection-item-name').append(col.name),
      $$('span').addClass('se-collection-counter').append(col.count),
      $$('span').addClass('se-collection-item-description').append(col.description)
    )
    
    return el
  }

  _selectCollection(id, e) {
    e.preventDefault()
    e.stopPropagation()
    this.send('openCollection', id)
  }

}

export default CollectionItem
