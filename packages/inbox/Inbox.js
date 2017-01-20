import ListScrollPane from '../common/ListScrollPane'
import DoubleSplitPane from '../common/DoubleSplitPane'
import AbstractFeedLoader from '../common/AbstractFeedLoader'
import concat from 'lodash/concat'
import extend from 'lodash/extend'

/*
  Represents Inbox page.

  Component splits into three parts:
  - Filters
  - Feed
  - Document Viewer
*/
class Inbox extends AbstractFeedLoader {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      'openDocument': this._openDocument,
      'openTheme': this._openTheme,
      'notify': this._notify,
      'connectSession': this._connectSession,
      'switchMode': this._switchMode
    })
  }

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let appsConfig = this.context.config.apps
    let currentAppConfig = appsConfig[this.props.app]
    let Header = this.getComponent('header')
    let Feed = this.getComponent('feed')
    let Filters = this.getComponent('filters')
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
        $$(Filters, {
          rubrics: this.state.rubrics,
          entities: this.state.entities,
          acceptor: currentAppConfig.configurator || currentAppConfig.counterrubrics,
          filters: this.state.filters
        }).ref('filters'),
        $$(ListScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'left'
        }).append(
          $$(Feed, extend({}, this.state, {modes: true})).ref('feed')
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
    let state = {documentId: documentId}
    this.extendState(state)
    feed.setActiveItem(documentId)
    this.updateUrl(documentId)
    
    loader.extendProps({
      documentId: documentId
    })
  }

  _openTheme(documentId, themeId) {
    let loader = this.refs.loader
    let feed = this.refs.feed

    let state = {documentId: documentId}
    if(themeId) state.themeId = themeId
    this.extendState(state)
    feed.setActiveItem(documentId)
    this.updateUrl(documentId, themeId)
    
    loader.extendProps({
      documentId: documentId
    })
  }

  updateUrl(documentId, themeId) {
    let urlHelper = this.context.urlHelper
    let route = {page: 'inbox', documentId: documentId, app: this.props.app}
    if(themeId) route.themeId = themeId
    urlHelper.writeRoute(route)
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadDocuments()
  }

  _switchMode(mode) {
    this.extendState({
      mode: mode
    })
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
    let listMethod = state.mode === 'themed' ? 'listThemedDocuments' : 'listDocuments'
    let items = []

    let filters = state.filters

    documentClient[listMethod](
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

}

export default Inbox
