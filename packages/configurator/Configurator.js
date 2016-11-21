import filter from 'lodash/filter'
import concat from 'lodash/concat'
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
        accepted: false
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
    urlHelper.writeRoute({page: 'configurator', documentId: documentId})
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
}

export default Configurator
