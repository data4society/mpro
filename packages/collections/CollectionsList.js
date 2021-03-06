import { Button, Component, Input, Modal, uuid } from 'substance'
import each from 'lodash/each'
import concat from 'lodash/concat'
import findIndex from 'lodash/findIndex'
import isEmpty from 'lodash/isEmpty'
import CollectionEditor from './CollectionEditor'
import CollectionItem from './CollectionItem'

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
      //active: this.props.collectionId,
      perPage: 30,
      pagination: true,
      totalItems: 0,
      order: "edited",
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
        return item.collection_id === this.props.collectionId
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
          $$(Button, {label: 'add-collection', style: 'default', icon: 'collection-add'}).addClass('se-add-collection')
            .on('click', this._createCollection)
        )
      )
    )

    if(!isEmpty(collections)) {
      each(collections, function(col) {
        let isSelected = this.props.collectionId === col.collection_id
        el.append(
          $$(CollectionItem, {collection: col, active: isSelected}).ref(col.collection_id)
        )
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
    if(this.props.collectionId) {
      this.extendState({edit: true})
    }
  }

  _createCollection() {
    let authClient = this.context.authenticationClient
    let user = authClient.getUser()
    let dataClient = this.context.documentClient
    let collection = {
      collection_id: uuid(),
      name: 'New collection',
      description: 'No description available',
      author: user.user_id,
      private: true,
      public: false,
      accepted: false,
      app_id: this.props.app
    }

    dataClient.createCollection(collection, function(err, col) {
      if (err) {
        console.error(err)
        return
      }

      let list = this.state.list
      list.unshift(col)
      let total = parseInt(this.state.totalItems, 10) + 1

      this.extendState({list: list, totalItems: total})
    }.bind(this))
  }

  _onModalClose() {
    let updated = this.refs['editor'].state
    let list = this.state.list
    let activeIndex = findIndex(list, function(item) {
      return item.collection_id === this.props.collectionId
    }.bind(this))
    list[activeIndex].name = updated.name
    list[activeIndex].description = updated.description
    list[activeIndex].private = updated.private
    list[activeIndex].public = updated.public
    list[activeIndex].accepted = updated.accepted

    let collectionId = list[activeIndex].collection_id
    let dataClient = this.context.documentClient
    dataClient.updateCollection(collectionId, updated, function(err) {
      if (err) {
        console.error(err)
        return
      }

      this.extendState({list: list, edit: false})
    }.bind(this))
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

    dataClient.listCollections({app_id: this.props.app}, {
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
