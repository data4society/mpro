import { Component } from 'substance'
import clone from 'lodash/clone'
import concat from 'lodash/concat'
import each from 'lodash/each'
import extend from 'lodash/extend'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import isNull from 'lodash/isNull'

/*
  Abstract Feed Loader class.

  Loads documents and rubrics.
*/

class AbstractFeedLoader extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'updateFeedItem': this._updateFeedItem,
      'toggleDataFilter': this._toggleDataFilter,
      'toggleFtsFilter': this._toggleFtsFilter,
      'toggleEntityFacet': this._toggleEntityFacet,
      'selectEntityFacets': this._selectEntityFacets,
      'saveEntityFacets': this._saveEntityFacets,
      'loadEntityFacets': this._loadEntityFacets
    })
  }

  didMount() {
    this._loadRubrics()
    this._loadEntities()
    this._loadDocuments()
    //this.pollTimer = setInterval(this._pollDocuments.bind(this), 60000);
  }

  dispose() {
    clearInterval(this.pollTimer)
  }

  willUpdateState(state) {
    let oldFilters = this.state.filters
    let newFilters = state.filters
    if(!isEqual(oldFilters, newFilters) && !state.error) {
      if(!newFilters.theme_id) {
        this._loadRubrics(state)
        this._loadEntities(state)
      }
      this._loadDocuments(state)
    } else if (!isEqual(this.state.entitiesFacets, state.entitiesFacets) && !state.error) {
      this._loadEntities(state)
    } else if (!isEqual(this.state.mode, state.mode) && !state.error) {
      this._loadDocuments(state)
    }
  }

  willReceiveProps(props) {
    if(this.props.app !== props.app) {
      let state = this.getInitialState()
      state.filters.app_id = props.app
      this.setState(state)
      this._loadRubrics()
      this._loadDocuments()
    }
  }

  /*
    Initial state of component, contains:
    - filters: default filters (e.g. not show training documents)
    - perPage: number of documents per page
    - order: sort by property
    - direction: order of sorting (desc, asc)
    - documentItems: loaded document items (used internaly)
    - pagination: flag to show/hide pager (used internaly)
    - totalItems: total number of items (used internaly)
    - rubrics: document with all rubrics (used internaly)
    - addNew: show button for adding a new document
  */
  getInitialState() {
    let entities = this.props.entities ? this.props.entities.split(',') : []
    return {
      filters: {'training': false, app_id: this.props.app, 'rubrics @>': [], 'entities @>': entities, 'created <=': new Date().toISOString() },
      perPage: 10,
      order: 'published',
      direction: 'desc',
      documentId: this.props.documentId,
      documentItems: [],
      pagination: false,
      totalItems: 0,
      mode: this.props.mode,
      rubrics: {},
      entities: {},
      entitiesFacets: entities,
      addNew: false
    }
  }

  /*
    Rubrics loader.

    Loads rubrics and creates document with all rubrics.
  */
  _loadRubrics(newState) {
    let state = newState || this.state
    let documentClient = this.context.documentClient
    let appsConfig = this.context.config.apps
    let currentAppConfig = appsConfig[this.props.app]
    let counter = currentAppConfig.counterrubrics
    let filters = state.filters

    documentClient.listRubrics(filters, {limit: 300, order: "name asc", counter: counter}, function(err, result) {
      if (err) {
        console.error(err)
        this.setState({
          error: new Error('Rubrics loading failed')
        })
        return
      }

      let configurator = this.context.configurator
      let importer = configurator.createImporter('rubrics')
      let facets = state.filters['rubrics @>']
      let rubrics = importer.importDocument(result, facets)
      rubrics.on('document:changed', this._onRubricsChanged, this)

      this.extendState({
        rubrics: rubrics
      })
    }.bind(this))
  }

  _loadEntities(newState) {
    let state = newState || this.state
    let documentClient = this.context.documentClient
    let appsConfig = this.context.config.apps
    let currentAppConfig = appsConfig[this.props.app]
    if(currentAppConfig.entities && state.entitiesFacets.length > 0) {
      let filters = state.filters
      let entities = filters['entities @>']
      let options = {
        columns: [
          'entity_id',
          'name',
          "(SELECT COUNT(*) from records WHERE entity_id::text = ANY(records.entities) AND '{" + entities.join(',') + "}' <@ records.entities AND '{" + filters['rubrics @>'].join(',') + "}' <@ records.rubrics AND app_id = '" + this.props.app + "') AS count"
        ]
      }

      documentClient.listEntities({'entity_id': state.entitiesFacets}, options, (err, result) => {
        if (err) {
          console.error(err)
          this.setState({
            error: new Error('Rubrics loading failed')
          })
          return
        }

        let entitiesData = {}

        each(result.records, entity => {
          entitiesData[entity.entity_id] = entity
          entitiesData[entity.entity_id].active = entities.indexOf(entity.entity_id) > -1
        })

        this.extendState({
          entities: entitiesData
        })
      })
    }
  }

  /*
    Loads documents
  */
  _loadDocuments(newState) {
    let state = newState || this.state
    let documentClient = this.context.documentClient
    let perPage = state.perPage
    let order = state.order
    let direction = state.direction
    let pagination = state.pagination
    let items = []

    let filters = state.filters

    documentClient.listDocuments(
      filters,
      {
        limit: perPage,
        offset: pagination ? state.documentItems.length : 0,
        order: order + ' ' + direction
      },
      function(err, documents) {
        if (err) {
          console.error(err)
          this.setState({
            error: new Error('Documents loading failed')
          })
          return
        }

        if(pagination) {
          items = concat(state.documentItems, documents.records)
        } else {
          items = documents.records
        }

        this.extendState({
          documentItems: items,
          totalItems: documents.total,
          lastQueryTime: new Date()
        })
      }.bind(this)
    )
  }

  /*
    Documents long polling.
    Will query for a new documents with setted up filters
    since last query time.
  */
  _pollDocuments() {
    let documentClient = this.context.documentClient
    let filters = extend({}, this.state.filters, {"created >": this.state.lastQueryTime})
    let order = this.state.order
    let direction = this.state.direction
    let items = []
    documentClient.listDocuments(
      filters,
      {
        order: order + ' ' + direction
      },
      function(err, documents) {
        if (err) {
          console.error(err)
          this.setState({
            error: new Error('Documents polling failed')
          })
          return
        }

        if(documents.total > 0) {
          items = concat(documents.records, this.state.documentItems)
          this.extendState({
            documentItems: items,
            totalItems: parseInt(documents.total, 10) + parseInt(this.state.totalItems, 10),
            lastQueryTime: new Date()
          })
        }
      }.bind(this)
    )
  }

  _updateFeedItem(documentId, meta) {
    let feed = this.refs.feed
    let feedItem = feed.refs[documentId]
    if(feedItem) {
      let document = extend({}, feedItem.props.document, {meta: meta})
      feedItem.extendProps({document: document, update: true})
    }
  }

  _toggleEntityFacet(entityId) {
    let filters = clone(this.state.filters)
    let entities = this.state.entities
    let activeFacets = clone(filters['entities @>'])
    entities[entityId].active = !entities[entityId].active
    let facetIndex = activeFacets.indexOf(entityId)
    if(facetIndex > -1) {
      activeFacets.splice(facetIndex, 1)
    } else {
      activeFacets.push(entityId)
    }
    filters['entities @>'] = activeFacets
    this.extendState({
      entities: entities,
      filters: filters,
      pagination: false
    })
  }

  _toggleDataFilter(prop, value) {
    let filters = clone(this.state.filters)
    let propName = 'meta->>' + prop
    if(!isNull(value)) {
      filters[propName] = value
    } else {
      delete filters[propName]
    }

    this.extendState({
      filters: filters,
      pagination: false
    })
  }

  _toggleFtsFilter(value) {
    let filters = clone(this.state.filters)
    if(!isEmpty(value)) {
      filters.fts = value
    } else {
      delete filters.fts
    }

    this.extendState({
      filters: filters,
      pagination: false
    })
  }

  _selectEntityFacets(selectedEntities) {
    let entitiesFacets = selectedEntities.id
    let filters = clone(this.state.filters)
    let activeFacets = clone(filters['entities @>'])
    each(activeFacets, facet => {
      let facetIndex = entitiesFacets.indexOf(facet)
      if(facetIndex === -1) {
        activeFacets.splice(facetIndex, 1)
      }
    })
    filters['entities @>'] = activeFacets
    let stateUpdate = {
      entitiesFacets: entitiesFacets,
      filters: filters,
      pagination: false
    }
    if(entitiesFacets.length === 0) stateUpdate.entities = []
    this.extendState(stateUpdate)
  }

  _saveEntityFacets() {
    let app = this.props.app
    let savedEntityFacets = window.localStorage.getItem('entityFacets')
    let entityFacets = savedEntityFacets ? JSON.parse(savedEntityFacets) : {}
    entityFacets[app] = this.state.entitiesFacets
    window.localStorage.setItem('entityFacets', JSON.stringify(entityFacets))
  }

  _loadEntityFacets() {
    let filters = clone(this.state.filters)
    filters['entities @>'] = []
    let app = this.props.app
    let savedEntityFacets = window.localStorage.getItem('entityFacets')
    let entityFacets = savedEntityFacets ? JSON.parse(savedEntityFacets) : {}
    let stateUpdate = {
      entitiesFacets: entityFacets[app] || [],
      filters: filters,
      pagination: false
    }
    this.extendState(stateUpdate)
  }

  /*
    Called when something is changed on rubric model.
    If some of rubrics got active, then we will load
    rubrics again with new filters.
  */
  _onRubricsChanged(change) {
    let facetChange = false
    each(change.updated, function(val, key){
      if(key.indexOf('active') > -1) {
        facetChange = true
      }
    })

    if(facetChange) this._applyFacets()
  }

  /*
    Called when facets changed.
    Will change filters and load rubrics again.
  */
  _applyFacets() {
    let defaultState = this.getInitialState()
    let rubrics = this.state.rubrics
    let filters = this.state.filters
    let facets = rubrics.getActive()
    let newFilters = {}
    rubrics.off(this)

    newFilters['rubrics @>'] = facets
    this.extendState({
      filters: extend({}, filters, newFilters),
      pagination: defaultState.pagination,
      perPage: defaultState.perPage,
      documentItems: []
    })
  }
}

export default AbstractFeedLoader
