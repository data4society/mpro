import { CollabClient, CollabSession, Component, JSONConverter, WebSocketConnection } from 'substance'
import isEmpty from 'lodash/isEmpty'
import Info from './Info'
import Viewer from '../viewer/Viewer'
import Editor from '../editor/Editor'

let converter = new JSONConverter()

/*
  Loader class.

  Used for retrieving document, configurator and
  initilise collaboration session.
*/

class Loader extends Component {
  constructor(...args) {
    super(...args)

    let appConfig = this.context.config
    let authenticationClient = this.context.authenticationClient

    this.conn = new WebSocketConnection({
      wsUrl: appConfig.wsUrl || 'ws://' + appConfig.host + ':' + appConfig.port
    })

    this.collabClient = new CollabClient({
      connection: this.conn,
      enhanceMessage: function(message) {
        let userSession = authenticationClient.getSession()
        if (userSession) {
          message.sessionToken = userSession.sessionToken
        }
        return message
      }
    })

    this.collabClient.on('disconnected', this._onCollabClientDisconnected, this)
    this.collabClient.on('connected', this._onCollabClientConnected, this)
  }

  getInitialState() {
    return {
      session: null, // CollabSession will be stored here, if null indicates we are in loading state
      error: null, // used to display error messages e.g. loading of document failed
    }
  }

  didMount() {
    let documentId = this.getDocumentId()
    if (!isEmpty(documentId)) {
      // load the document after mounting
      this._loadDocument(this.getDocumentId())
    } else {
      return true
    }
  }

  willReceiveProps(newProps) {
    if (newProps.documentId !== this.props.documentId && !isEmpty(newProps.documentId)) {
      this.dispose()
      // TODO: Use setState instead?
      this.state = this.getInitialState()
      this._loadDocument(newProps.documentId)
    }
  }

  dispose() {
    if (this.state.session) {
      this.state.session.off(this)
      this.state.session.dispose()
    }
    this.collabClient.off(this)
    this.collabClient.dispose()
  }

  getDocumentId() {
    return this.props.documentId
  }

  getChildConfigurator(schemaName) {
    let mode = this.props.mode
    let mproConfigurator = this.context.configurator
    return mproConfigurator.getConfigurator(mode + '-' + schemaName)
  }

  _onError(err) {
    this.extendState({
      error: {
        type: 'error',
        message: err.name
      }
    })
  }

  _onCollabClientDisconnected() {
    this.send('notify', {type: 'error', message: 'Connection lost! After reconnecting, your changes will be saved.'})
  }

  _onCollabClientConnected() {
    this.send('notify', null)
  }

  /*
    Extract error message for error object. Also consider first cause.
  */
  _onCollabSessionError(err) {
    let message = [
      err.name
    ]
    if (err.cause) {
      message.push(err.cause.name)
    }
    this.send('notify', {type: 'error', message: message.join(' ')})
  }

  _onCollabSessionSync() {
    this.send('notify', null)
  }

  /*
    Loads a document and initializes a CollabSession
  */
  _loadDocument(documentId) {
    let collabClient = this.collabClient
    let documentClient = this.context.documentClient

    documentClient.getDocument(documentId, function(err, docRecord) {
      if (err) {
        this._onError(err)
        return
      }
      let schemaName = docRecord.data.schema.name

      let configurator = this.getChildConfigurator(schemaName)
      let article = configurator.createArticle()
      let doc = converter.importDocument(article, docRecord.data)

      let session = new CollabSession(doc, {
        documentId: documentId,
        version: docRecord.version,
        collabClient: collabClient
      })

      // Listen for errors and sync start events for error reporting
      session.on('error', this._onCollabSessionError, this)
      session.on('sync', this._onCollabSessionSync, this)

      // HACK: For debugging purposes
      window.doc = doc
      window.session = session

      this.setState({
        configurator: configurator,
        documentInfo: new Info(docRecord),
        session: session
      })
    }.bind(this))
  }

  render($$) {
    let el = $$('div').addClass('sc-edit-document')

    let EditorClass

    if (this.props.mode === 'viewer') {
      EditorClass = Viewer
    } else if (this.props.mode === 'editor') {
      EditorClass = Editor
    }

    if (this.state.error) {
      this.send('notify', {type: 'error', message: this.state.error.message})
    } else if (isEmpty(this.props.documentId)) {
      el.append(
        $$('div').addClass('no-document').append(
          $$('p').append(this.getLabel('no-document'))
        )
      )
    } else if (this.state.session) {
      this.send('connectSession', this.state.session)
      el.append(
        $$(EditorClass, {
          configurator: this.state.configurator,
          documentInfo: this.state.documentInfo,
          documentSession: this.state.session,
          rubrics: this.props.rubrics,
          app: this.props.app
        }).ref('documentViewer')
      )
    }

    return el
  }

  getViewer() {
    return this.refs.documentViewer
  }
}

export default Loader
