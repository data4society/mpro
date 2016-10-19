import ListScrollPane from '../common/ListScrollPane'
import DoubleSplitPane from '../common/DoubleSplitPane'
import AbstractFeedLoader from '../common/AbstractFeedLoader'

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
      'notify': this._notify,
      'connectSession': this._connectSession
    })
  }

  render($$) {
    let authenticationClient = this.context.authenticationClient
    let Header = this.getComponent('header')
    let Feed = this.getComponent('feed')
    let Filters = this.getComponent('filters')
    let Loader = this.getComponent('loader')
    let Notification = this.getComponent('notification')
    let Collaborators = this.getComponent('collaborators')

    let el = $$('div').addClass('sc-inbox')

    let header = $$(Header, {
      actions: {
        'configurator': this.getLabel('configurator-menu')
      }
    })

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
          mode: 'viewer',
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

  updateUrl(documentId) {
    let urlHelper = this.context.urlHelper
    urlHelper.writeRoute({page: 'inbox', documentId: documentId})
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

export default Inbox
