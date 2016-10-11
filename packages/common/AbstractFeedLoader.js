import { Component } from 'substance'
import isEqual from 'lodash/isEqual'
import extend from 'lodash/extend'
import concat from 'lodash/concat'
import each from 'lodash/each'

/*
  Abstract Feed Loader class.

  Loads documents and rubrics.
*/

class AbstractFeedLoader extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'updateFeedItem': this._updateFeedItem
    })
  }

  didMount() {
    this._loadRubrics()
    this._loadDocuments()
    //this.pollTimer = setInterval(this._pollDocuments.bind(this), 60000);
  }

  dispose() {
    clearInterval(this.pollTimer)
  }

  willUpdateState(state) {
    let oldFilters = this.state.filters
    let newFilters = state.filters
    if(!isEqual(oldFilters, newFilters)) {
      this._loadRubrics(state)
      this._loadDocuments(state)
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
    return {
      filters: {'training': false, 'rubrics @>': []},
      perPage: 10,
      order: 'created',
      direction: 'desc',
      documentId: this.props.documentId,
      documentItems: [],
      pagination: false,
      totalItems: 0,
      rubrics: {},
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
    let filters = state.filters

    documentClient.listRubrics(filters, {limit: 300}, function(err, result) {
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
        offset: state.documentItems.length,
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
