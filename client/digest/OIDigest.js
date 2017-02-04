import { Component, Grid, Layout, SplitPane, request } from 'substance'
import concat from 'lodash/concat'
import each from 'lodash/each'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import moment from 'moment'
import OIHeader from './OIHeader'
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
    if(this.state.activeCollection !== oldState.activeCollection) {
      this._loadTopEntities()
    }
    if(!isEqual(this.state.mode, oldState.mode)) {
      if(this.state.mode === 'documents') {
        this._loadDocuments()
      } else if (this.state.mode === 'entities') {
        this._loadEntities()
      }
    }
  }

  getInitialState() {
    return {
      endpoint: 'https://mpro.d4s.io',
      collectionsKey: 'ed685693-c93a-3ee3-9879-2c5e906d920a',
      collectionDocsKey: 'a27aecc2-5c97-5347-7074-805af59808ae',
      entityDocsKey: 'ce0d823c-798a-f9e7-d98c-6b1812837214',
      topEntitiesKey: '62bf1f46-c5fd-bb1e-c215-f962512da4f4',
      title: 'Новости о политических преследованиях',
      collections: [],
      topEntities: [],
      activeCollection: '',
      activeEntity: {},
      perPage: 10,
      page: 1,
      mode: 'documents',
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

    el.append(
      $$(OIHeader),
      this.renderHeader($$),
      layout
    )

    return el
  }

  renderHeader($$) {
    let wrapper = $$('div').addClass('se-top-panel')
    let el = $$('div').addClass('se-header-panel')

    el.append(
      $$('div').addClass('se-header-title').setInnerHTML(this.state.title)
    )

    if(this.state.total) {
      el.append(
        $$('div').addClass('se-header-stats').append(
          this.state.total,
          $$('i').addClass('fa fa-newspaper-o')
        )
      )
    }

    wrapper.append(el)

    return wrapper
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
    entitiesEl.append(
      $$('div').addClass('se-title')
        .append('Упоминания:')
        .on('click', this._switchMode.bind(this, 'entities'))
    )
    each(entities, function(entity) {
      let item = $$('div').addClass('se-entity-node').append(
        $$('span').addClass('se-node-name').append(entity.name),
        $$('span').addClass('se-node-count').append(entity.cnt)
      ).on('click', this._entityFilter.bind(this, entity))

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
      if(this.state.mode === 'documents') {
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
              $$(Grid.Cell, {columns: 6}).addClass('se-source-name').append(sourceName),
              $$(Grid.Cell, {columns: 6}).addClass('se-item-published').append(published),
              $$('div').addClass('se-divider'),
              $$(Grid.Row).addClass('se-item-title').append(item.meta.title),
              $$(Grid.Row).addClass('se-item-abstract').append(item.meta.abstract),
              entities
            )
          )
        }.bind(this))
      } else if (this.state.mode === 'entities') {
        items.forEach(item => {
          grid.append(
            $$(Grid.Row).addClass('se-row se-entity-list-item').ref(item.id).append(
              $$(Grid.Cell, {columns: 11}).addClass('se-entity-name').append(item.name),
              $$(Grid.Cell, {columns: 1}).addClass('se-entity-counter').append(item.cnt)
            ).on('click', this._entityFilter.bind(this, item))
          )
        })
      }

      el.append(grid)
      if(items.length < total) {
        el.append($$(Pager, {total: total, loaded: items.length}))
      }
    }

    if(items.length === 0) {
      el.append(this.renderSpinner($$))
    }
    
    return el
  }

  renderSpinner($$) {
    let el = $$('div').addClass('se-spinner')
    el.append($$('img').attr({src: '/digest/assets/loader.gif'}))
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
    this.extendState({activeCollection: activeCollection, mode: 'documents', items: [], total: 0})
  }

  _entityFilter(entity, e) {
    e.preventDefault()
    if(!isEqual(this.state.activeEntity, entity)) {
      this.extendState({activeEntity: entity, title: 'Все новости о: <em>' + entity.name + '</em>', mode: 'documents', items: [], total: 0})
    } else {
      this.extendState({activeEntity: {}, items: [], total: 0})
    }
  }

  _loadMore() {
    if(this.state.mode === 'documents') {
      this._loadDocuments(true)
    } else if(this.state.mode === 'entities') {
      this._loadEntities(true)
    }
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

  _loadEntities(pagination) {
    let perPage = this.state.perPage
    
    let options = {
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0
    }
    let optionsRequest = encodeURIComponent(JSON.stringify(options))
    let url = this.state.endpoint + '/api/public/' + this.state.topEntitiesKey + '?options=' + optionsRequest

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
    if(this.state.activeCollection) url += '?query="' + this.state.activeCollection + '"'
    request('GET', url, null, function(err, topEntities) {
      if (err) {
        console.error('ERROR', err)
        return
      }

      this.extendState({topEntities: topEntities.records})
    }.bind(this))
  }

  _switchMode(mode) {
    this.extendState({mode: mode, items: [], total: 0})
  }

}

export default OIDigest
