import { Component, Input } from 'substance'
import each from 'lodash/each'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'

class CollectionSelector extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore
    })
  }

  getInitialState() {
    return {
      list: [],
      selected: this.props.collections,
      perPage: 5,
      pagination: true,
      totalItems: 0,
      order: "position(collection_id::text in '" + this.props.collections.join(', ') + "')",
      direction: 'desc'
    }
  }

  didMount() {
    this._loadCollectionList()
  }

  render($$) {
    let el = $$('div').addClass('sc-collector')
    let selected = this.state.selected
    let collections = this.state.list 
    let Pager = this.getComponent('pager')
    let searchInput = $$('div').addClass('se-collector-search').append(
      $$(Input, {
        type: 'search',
        placeholder: this.getLabel('collector-search-placeholder'),
        centered: true
      })
      .on('search', this._searchCollections)
      .ref('searchInput')
    )

    el.append(searchInput)
    
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

    if(this.state.pagination && this.state.list.length < this.state.totalItems) {
      el.append(
        $$(Pager, {
          total: this.state.totalItems,
          loaded: this.state.list.length
        })
      )
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

  _searchCollections() {
    let searchValue = this.refs['searchInput'].val()

    if(isEmpty(searchValue)) {
      this.setState(this.getInitialState())
      return this._loadCollectionList()
    }

    let dataClient = this.context.documentClient
    dataClient.findCollections(searchValue, {}, function(err, collections) {
      if (err) {
        console.error(err)
        return
      }
      
      this.extendState({list: collections.records, totalItems: collections.total, pagination: false})
    }.bind(this))
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadCollectionList()
  }

  _loadCollectionList() {
    let order = this.state.order
    let perPage = this.state.perPage
    let direction = this.state.direction
    let pagination = this.state.pagination
    let list = this.state.list
    let dataClient = this.context.documentClient
    let items = []

    dataClient.listCollections({}, {
      limit: perPage, 
      offset: list.length,
      order: order + ' ' + direction
    }, function(err, collections) {
      if (err) {
        console.error(err)
        return
      }

      if(pagination) {
        items = concat(list, collections.records)
      } else {
        items = collections.records
      }
      
      this.extendState({list: items, totalItems: collections.total})
    }.bind(this))
  }
}

export default CollectionSelector
