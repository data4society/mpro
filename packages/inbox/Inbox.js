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
      'closeTheme': this._closeTheme,
      'notify': this._notify,
      'connectSession': this._connectSession,
      'switchMode': this._switchMode
    })
  }

  didMount() {
    let theme = this.props.themeId
    this._loadRubrics()
    this._loadEntities()
    this._loadDocuments(false, theme)
    this.refs.keytrap.el.focus()
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
      $$('textarea').addClass('se-keytrap').ref('keytrap')
        .css({ position: 'absolute', width: 0, height: 0 })
        .on('keydown', this._onKeyDown),
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

    this.refs.keytrap.el.focus()
  }

  _openTheme(documentId, themeId) {
    let loader = this.refs.loader
    let feed = this.refs.feed

    let filtersState = {}
    if(themeId) filtersState.theme_id = themeId
    filtersState = extend({}, this.state.filters, filtersState)
    this.extendState({filters: filtersState, pagination: false})
    feed.setActiveItem(documentId)
    this.updateUrl(documentId, themeId, 'themed')
    loader.extendProps({
      documentId: documentId
    })
  }

  _closeTheme() {
    let filtersState = this.state.filters
    let filters = extend({}, filtersState, {theme_id: undefined})
    delete filters.theme_id
    this.updateUrl(this.props.documentId)
    this.extendState({filters: filters})
  }

  updateUrl(documentId, themeId, mode) {
    let urlHelper = this.context.urlHelper
    let route = {page: 'inbox', documentId: documentId, app: this.props.app}
    if(themeId) route.themeId = themeId
    mode = mode || this.props.mode
    if(mode) route.mode = mode
    urlHelper.writeRoute(route)
  }

  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadDocuments()
  }

  _switchMode(mode) {
    this.updateUrl(this.props.documentId, false, mode)
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
  _loadDocuments(newState, theme) {
    let state = newState || this.state
    let documentClient = this.context.documentClient
    let perPage = state.perPage
    let order = state.order
    let direction = state.direction
    let pagination = state.pagination
    let listMethod = state.mode === 'themed' ? 'listThemedDocuments' : 'listDocuments'
    let items = []

    let filters = state.filters
    if(theme) filters.theme_id = theme
    if(state.mode !== 'themed') delete filters.theme_id
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

  _onKeyDown(e) {
    switch ( e.keyCode ) {
      // handle up and down keys
      case 38:
        return this._handleUpArrowKey()
      case 40:
        return this._handleDownArrowKey()
      default:
        break
    }

    let handled = false
    // handle accept combo
    if ( (e.ctrlKey||e.metaKey) && e.keyCode === 83) {
      let commandManager = this._getViewerCommandManager()
      commandManager.executeCommand('acceptor')
      handled = true
    }
    // handle negative accept combo
    else if (e.keyCode === 69 && (event.metaKey||event.ctrlKey)) {
      let commandManager = this._getViewerCommandManager()
      commandManager.executeCommand('negative')
      handled = true
    }
    // handle moderate accept combo
    else if (e.keyCode === 86 && (event.metaKey||event.ctrlKey)) {
      let commandManager = this._getViewerCommandManager()
      commandManager.executeCommand('moderator')
      handled = true
    }

    if (handled) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  _getViewerCommandManager() {
    const loader = this.refs.loader
    const viewer = loader.getViewer()
    return viewer.commandManager
  }

  _handleUpArrowKey() {
    const prevDocumentId = this._getPrevDocumentId()
    if(!prevDocumentId) {
      return false
    }
    this._openDocument(prevDocumentId)
  }

  _handleDownArrowKey() {
    const nextDocumentId = this._getNextDocumentId()
    if(!nextDocumentId) {
      if(parseInt(this.state.totalItems, 10) === this.state.documentItems.length) {
        return false
      }
      return this._loadMore()
    }
    this._openDocument(nextDocumentId)
  }

  _getNextDocumentId() {
    const documentItems = this.state.documentItems
    const documentId = this.state.documentId
    const currentIndex = documentItems.findIndex(i => {
      return i.documentId === documentId
    })
    const nextItem = documentItems[currentIndex + 1]
    return nextItem ? nextItem.documentId : false
  }

  _getPrevDocumentId() {
    const documentItems = this.state.documentItems
    const documentId = this.state.documentId
    const currentIndex = documentItems.findIndex(i => {
      return i.documentId === documentId
    })
    if(currentIndex > 0) {
      const prevItem = documentItems[currentIndex - 1]
      return prevItem ? prevItem.documentId : false
    } else {
      return false
    }
  }

}

export default Inbox
