import { Component, Grid, Layout, SplitPane, request } from 'substance'
import concat from 'lodash/concat'
import each from 'lodash/each'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import moment from 'moment'
import ListScrollPane from './ListScrollPane'
import Pager from './Pager'

class OIDigest extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore
    })
  }

  didMount() {
    this._loadCollections()
    this._loadTopEntities()
  }

  didUpdate(oldProps, oldState) {
    if(!isEqual(this.state.collections, oldState.collections) || this.state.activeCollection !== oldState.activeCollection || !isEqual(this.state.activeEntity, oldState.activeEntity)) {
      this._loadDocuments()
    }
  }

  getInitialState() {
    return {
      endpoint: 'https://mpro.d4s.io',
      collectionsKey: 'ed685693-c93a-3ee3-9879-2c5e906d920a',
      collectionDocsKey: 'a27aecc2-5c97-5347-7074-805af59808ae',
      entityDocsKey: 'ce0d823c-798a-f9e7-d98c-6b1812837214',
      topEntitiesKey: '62bf1f46-c5fd-bb1e-c215-f962512da4f4',
      collections: [],
      topEntities: [],
      activeCollection: '',
      activeEntity: {},
      perPage: 5,
      page: 1,
      items: []
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-digest sc-container')
    
    let layout = $$(Layout, {
      width: 'large',
      textAlign: 'left',
      noPadding: false
    })

    layout.append(
      $$(SplitPane, {
        sizeA: '300px',
        splitType: 'vertical'
      }).append(
        this.renderSideBar($$),
        $$(ListScrollPane, {
          scrollbarType: 'substance', // defaults to native
          scrollbarPosition: 'right' // defaults to right
        }).append(this.renderContent($$))
      ).addClass('se-digest')
    )

    el.append(layout)

    return el
  }

  renderSideBar($$) {
    let el = $$('div').addClass('sc-collections')
    let collections = this.state.collections
    let entities = this.state.topEntities
    
    el.append($$('div').addClass('se-title').append('Темы:'))
    each(collections, function(collection) {
      let item = $$('div').addClass('se-collection-node').append(
        $$('span').addClass('se-node-name').append(collection.name),
        $$('span').addClass('se-node-count').append(collection.cnt)
      ).ref(collection.collection)
      .on('click', this._collectionFilter.bind(this, collection.collection))

      if(collection.collection === this.state.activeCollection) {
        item.addClass('se-active')
      }

      el.append(item)
    }.bind(this))


    let entitiesEl = $$('div').addClass('se-entities-list')
    entitiesEl.append($$('div').addClass('se-title').append('Упоминания:'))
    each(entities, function(entity) {
      let item = $$('div').addClass('se-entity-node').append(
        $$('span').addClass('se-node-name').append(entity.name),
        $$('span').addClass('se-node-count').append(entity.cnt)
      ).ref(entity.id)
      .on('click', this._entityFilter.bind(this, entity))

      if(entity.id === this.state.activeEntity.id) {
        item.addClass('se-active')
      }

      entitiesEl.append(item)
    }.bind(this))

    el.append(entitiesEl)

    return el
  }

  renderContent($$) {
    let items = this.state.items
    let total = this.state.total
    let el = $$('div').addClass('se-list-not-empty')
    let grid = $$(Grid)

    if (items) {
      items.forEach(function(item) {
        let entities = $$(Grid.Row).addClass('se-item-entities')
        item.entities.forEach(function(entity) {
          if(entity.name !== '') {
            let entityItem = $$('span')
              .addClass('se-item-entity')
              .append(entity.name)
              .on('click', this._entityFilter.bind(this, entity))

            entities.append(entityItem)
          }
        }.bind(this))
        let published = moment(item.meta.published).format('DD.MM.YYYY')
        let sourceName = this._getSourceName(item.meta.source)
        grid.append(
          $$('a').attr({href: item.meta.source, target: '_blank', class: 'se-row se-source'}).ref(item.doc_id).append(
            $$(Grid.Cell, {columns: 6}).append(sourceName),
            $$(Grid.Cell, {columns: 6}).addClass('se-item-published').append(published),
            $$('div').addClass('se-divider'),
            $$(Grid.Row).addClass('se-item-title').append(item.meta.title),
            $$(Grid.Row).addClass('se-item-abstract').append(item.meta.abstract),
            entities
          )
        )
      }.bind(this))

      el.append(grid)
      if(items.length < total) {
        el.append($$(Pager, {total: total, loaded: items.length}))
      }
    }
    return el
  }

  _getSourceName(url) {
    let re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
    let res = re.exec(url)
    if(res) {
      return res[1]
    } else {
      return ''
    }
  }

  _collectionFilter(colId) {
    let activeCollection = this.state.activeCollection !== colId ? colId : ''
    this.extendState({activeCollection: activeCollection, activeEntity: {}})
  }

  _entityFilter(entity, e) {
    e.preventDefault()
    this.extendState({activeCollection: '', activeEntity: entity})
  }

  _loadMore() {
    this._loadDocuments(true)
  }

  _loadCollections() {
    let url = this.state.endpoint + '/api/public/' + this.state.collectionsKey
    request('GET', url, null, function(err, collections) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({collections: collections})
    }.bind(this))
  }

  _loadDocuments(pagination) {
    let perPage = this.state.perPage
    
    let options = {
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0,
      entities: true
    }

    let optionsRequest = encodeURIComponent(JSON.stringify(options))

    let query
    let key

    if(this.state.activeCollection) {
      key = this.state.collectionDocsKey
      query = this.state.activeCollection
    } else if (!this.state.activeEntity.id) {
      let colIds = map(this.state.collections, function(c) {
        return c.collection
      })
      query = colIds.join(',')
      key = this.state.collectionDocsKey
    } else {
      key = this.state.entityDocsKey
      query = this.state.activeEntity.id
    }

    let url = this.state.endpoint + '/api/public/' + key + '/?query=' + query + '&options=' + optionsRequest
    
    request('GET', url, null, function(err, results) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      let items
      if(pagination) {
        items = concat(this.state.items, results.records)
      } else {
        items = results.records
      }

      this.extendState({
        items: items,
        total: results.total
      })
    }.bind(this))
  }

  _loadTopEntities() {
    let url = this.state.endpoint + '/api/public/' + this.state.topEntitiesKey
    request('GET', url, null, function(err, topEntities) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({topEntities: topEntities})
    }.bind(this))
  }

}

export default OIDigest
