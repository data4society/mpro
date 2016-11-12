import { Component, Input, Modal } from 'substance'
import each from 'lodash/each'
import concat from 'lodash/concat'
import findIndex from 'lodash/findIndex'
import isEmpty from 'lodash/isEmpty'
import CollectionEditor from './CollectionEditor'

class CollectionsList extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      'closeModal': this._onModalClose
    })
  }

  getInitialState() {
    return {
      list: [],
      active: this.props.collectionId,
      perPage: 30,
      pagination: true,
      totalItems: 0,
      order: "created",
      direction: 'desc',
      edit: false
    }
  }

  didMount() {
    this._loadCollectionList()
  }

  render($$) {
    let el = $$('div').addClass('sc-collections-list')

    let collections = this.state.list 
    let Pager = this.getComponent('pager')

    if(this.state.edit) {
      let activeIndex = findIndex(this.state.list, function(item) {
        return item.collection_id === this.state.active
      }.bind(this))

      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(CollectionEditor, this.state.list[activeIndex]).ref('editor')
        )
      ) 
    }

    let searchInput = $$('div').addClass('se-collections-search').append(
      $$(Input, {
        type: 'search',
        placeholder: this.getLabel('collection-search-placeholder'),
        centered: true
      })
      .on('search', this._searchCollections)
      .ref('searchInput')
    )

    el.append(searchInput)

    el.append(
      $$('div').addClass('se-collections-header').append(
        $$('span').addClass('se-collections-stats').append(
          this.state.totalItems + ' collections'
        ),
        $$('span').addClass('se-collections-actions').append(
          this.context.iconProvider.renderIcon($$, 'collection-edit')
            .on('click', this._editCollection),
          this.context.iconProvider.renderIcon($$, 'collection-add')
        )
      )
    )
    
    if(!isEmpty(collections)) {
      each(collections, function(col) {
        let isSelected = this.state.active === col.collection_id
        let item = $$('div').addClass('se-collection-item')
          .ref(col.collection_id)

        if(isSelected) {
          item.addClass('sm-selected')
        } else {
          item.on('click', this._selectCollection.bind(this, col.collection_id))
        }
        item.append(
          $$('span').addClass('se-collection-item-name').append(col.name),
          $$('span').addClass('se-collection-counter').append(col.count),
          $$('span').addClass('se-collection-item-description').append(col.description)
        )
        el.append(item)
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

  _selectCollection(id, e) {
    e.preventDefault()
    e.stopPropagation()
    this.extendState({
      active: id
    })
    this.send('openCollection', id)
  }

  _editCollection() {
    this.extendState({edit: true})
  }

  _onModalClose() {
    this.extendState({edit: false})
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadCollectionList()
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

export default CollectionsList
