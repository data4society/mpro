import clone from 'lodash/clone'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import ListScrollPane from '../common/ListScrollPane'
import DoubleSplitPane from '../common/DoubleSplitPane'
import AbstractFeedLoader from '../common/AbstractFeedLoader'

/*
  Represents Configurator page.

  Component splits into three parts:
  - Filters
  - Feed
  - Document Viewer
*/
class Configurator extends AbstractFeedLoader {
  constructor(...args) {
    super(...args)
    
    this.handleActions({
      'loadMore': this._loadMore,
      'openDocument': this._openDocument,
      'newDocument': this._newDocument,
      'deleteDocument': this._deleteDocument,
      'notify': this._notify,
      'connectSession': this._connectSession
    })
  }

  getInitialState() {
    return {
      filters: {'training': true, app_id: this.props.app, 'rubrics @>': []},
      perPage: 10,
      order: 'created',
      direction: 'desc',
      documentId: this.props.documentId,
      documentItems: [],
      pagination: false,
      totalItems: 0,
      rubrics: {},
      addNew: true
    }
  }

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let Header = this.getComponent('header')
    let Feed = this.getComponent('feed')
    let Filters = this.getComponent('filters')
    let Loader = this.getComponent('loader')
    let Notification = this.getComponent('notification')
    let Collaborators = this.getComponent('collaborators')

    let el = $$('div').addClass('sc-configurator')

    let header = $$(Header, this.props)

    header.outlet('content').append(
      $$(Notification, {}).ref('notification'),
      $$(Collaborators, {}).ref('collaborators')
    )

    el.append(
      header,
      $$(DoubleSplitPane, {splitType: 'vertical', sizeA: '300px', sizeB: '38%'}).append(
        $$(Filters, {rubrics: this.state.rubrics}).ref('filters'),
        $$(ListScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'left'
        }).append(
          $$(Feed, this.state).ref('feed')
        ),
        $$(Loader, {
          documentId: this.state.documentId,
          rubrics: this.state.rubrics,
          mode: 'editor',
          userSession: authenticationClient.getSession()
        }).ref('loader')
      )
    )

    return el
  }

  _openDocument(documentId) {
    let loader = this.refs.loader
    let feed = this.refs.feed

    this.extendState({documentId: documentId})
    feed.setActiveItem(documentId)
    this.updateUrl(documentId)
    
    loader.extendProps({
      documentId: documentId
    })
  }

  /*
    Creates a new training document
  */
  _newDocument() {
    let documentClient = this.context.documentClient
    let authenticationClient = this.context.authenticationClient
    let user = authenticationClient.getUser()
    let userId = user.user_id

    documentClient.createSource({
      status: 1001,
      published_date: new Date(),
      rubric_ids: [],
      stripped: '',
      type: 'tng',
      app_id: this.props.app
    }, function(err, source) {
      
      documentClient.createDocument({
        schemaName: 'mpro-tng',
        // TODO: Find a way not to do this statically
        // Actually we should not provide the userId
        // from the client here.
        info: {
          title: 'Untitled Article',
          abstract: '',
          source_type: 'mpro',
          userId: userId,
          training: true,
          rubrics: [],
          entities: [],
          accepted: false,
          source: source.doc_id,
          app_id: this.props.app
        }
      }, function(err, result) {
        let documentItems = concat(result, this.state.documentItems)
        let totalItems = parseInt(this.state.totalItems, 10) + 1
        this.extendState({
          documentItems: documentItems,
          totalItems: totalItems
        })
        this._openDocument(result.documentId)
      }.bind(this))
    }.bind(this))
  }

  /*
    Removes a document
  */

  _deleteDocument(documentId) {
    let documentClient = this.context.documentClient
    documentClient.deleteDocument(documentId, function(/*err, result*/) {
      let documentItems = this.state.documentItems
      let cleanedItems = filter(documentItems, function(i) { 
        return i.documentId !== documentId
      })
      let totalItems = parseInt(this.state.totalItems, 10) - 1
      this.extendState({
        documentId: '',
        documentItems: cleanedItems,
        totalItems: totalItems
      })
    }.bind(this))
  }

  updateUrl(documentId) {
    let urlHelper = this.context.urlHelper
    urlHelper.writeRoute({page: 'configurator', documentId: documentId, app: this.props.app})
  }

  _loadMore() {
    this.extendState({
      pagination: true
    });
    this._loadDocuments()
  }

  _notify(msg) {
    this.refs.notification.extendProps(msg)
  }

  _connectSession(session) {
    this.refs.collaborators.extendProps(session)
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

    let filters = clone(state.filters)

    if(filters['rubrics @>'].length === 0) {
      filters['rubrics'] = '{}'
    } else {
      delete filters['rubrics']
    }

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
}

export default Configurator
