import ListScrollPane from '../common/ListScrollPane'
import DoubleSplitPane from '../common/DoubleSplitPane'
import AbstractFeedLoader from '../common/AbstractFeedLoader'
import CollectionsList from './CollectionsList'
import extend from 'lodash/extend'
import isEqual from 'lodash/isEqual'

/*
  Represents Collections page.

  Component splits into three parts:
  - CollectionsList
  - Feed
  - Document Viewer
*/
class Collections extends AbstractFeedLoader {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      'openCollection': this._openCollection,
      'openDocument': this._openDocument,
      'notify': this._notify,
      'connectSession': this._connectSession
    })
  }

  didMount() {
    this._loadDocuments()
  }

  willUpdateState(state) {
    let oldFilters = this.state.filters
    let newFilters = state.filters
    if(!isEqual(oldFilters, newFilters)) {
      this._loadDocuments(state)
    }
  }

  getInitialState() {
    let collectionId = this.props.collectionId || ''
    return {
      filters: {'training': false, 'collections @>': [collectionId]},
      perPage: 10,
      order: 'created',
      direction: 'desc',
      collectionId: collectionId,
      documentId: this.props.documentId,
      documentItems: [],
      pagination: false,
      totalItems: 0,
      rubrics: {},
      addNew: false
    }
  }

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let Header = this.getComponent('header')
    let Feed = this.getComponent('feed')
    let Loader = this.getComponent('loader')
    let Notification = this.getComponent('notification')
    let Collaborators = this.getComponent('collaborators')

    let el = $$('div').addClass('sc-inbox')

    let header = $$(Header, this.props)

    header.outlet('content').append(
      $$(Notification, {}).ref('notification'),
      $$(Collaborators, {}).ref('collaborators')
    )

    el.append(
      header,
      $$(DoubleSplitPane, {splitType: 'vertical', sizeA: '300px', sizeB: '38%'}).append(
        $$(CollectionsList, {collectionId: this.state.collectionId, app: this.props.app}),
        $$(ListScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'left'
        }).append(
          $$(Feed, this.state).ref('feed')
        ),
        $$(Loader, {
          documentId: this.state.documentId,
          rubrics: this.state.rubrics,
          mode: 'viewer',
          userSession: authenticationClient.getSession(),
          app: this.props.app
        }).ref('loader')
      )
    )

    return el
  }

  _openDocument(documentId) {
    let loader = this.refs.loader
    let feed = this.refs.feed

    //this.extendState({documentId: documentId})
    feed.setActiveItem(documentId)
    this.updateUrl(documentId)
    
    loader.extendProps({
      documentId: documentId
    })
  }

  _openCollection(collectionId) {
    let defaultState = this.getInitialState()
    let filters = this.state.filters
    let newFilters = {}
    newFilters['collections @>'] = [collectionId]

    this.extendState({
      filters: extend({}, filters, newFilters),
      collectionId: collectionId,
      pagination: defaultState.pagination,
      perPage: defaultState.perPage,
      documentItems: []
    })

    this.updateUrlCollection(collectionId)
  }

  updateUrl(documentId) {
    let urlHelper = this.context.urlHelper
    urlHelper.writeRoute({page: 'collections', collectionId: this.state.collectionId, documentId: documentId, app: this.props.app})
  }

  updateUrlCollection(collectionId) {
    let urlHelper = this.context.urlHelper
    urlHelper.writeRoute({page: 'collections', collectionId: collectionId, documentId: this.state.documentId})
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadDocuments()
  }

  _notify(msg) {
    this.refs.notification.extendProps(msg)
  }

  _connectSession(session) {
    this.refs.collaborators.extendProps(session)
  }

}

export default Collections
