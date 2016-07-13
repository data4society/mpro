'use strict';

var CollabSession = require('substance/collab/CollabSession');
var JSONConverter = require('substance/model/JSONConverter');
var CollabClient = require('substance/collab/CollabClient');
var WebSocketConnection = require('substance/collab/WebSocketConnection');
var Component = require('substance/ui/Component');
var Viewer = require('../viewer/Viewer');
var converter = new JSONConverter();

/*
  Loader class.
  
  Used for retrieving document, configurator and
  initilise collaboration session.
*/

function Loader() {
  Component.apply(this, arguments);

  var appConfig = this.context.config;

  this.conn = new WebSocketConnection({
    wsUrl: appConfig.wsUrl || 'ws://' + appConfig.host + ':' + appConfig.port
  });

  this.collabClient = new CollabClient({
    connection: this.conn,
    enhanceMessage: function(message) {
      var userSession = this.props.userSession;
      if (userSession) {
        message.sessionToken = userSession.sessionToken;
      }
      return message;
    }.bind(this)
  });

  this.collabClient.on('disconnected', this._onCollabClientDisconnected, this);
  this.collabClient.on('connected', this._onCollabClientConnected, this);
}

Loader.Prototype = function() {

  this.getInitialState = function() {
    return {
      session: null, // CollabSession will be stored here, if null indicates we are in loading state
      error: null, // used to display error messages e.g. loading of document failed
      notification: null //used to display status messages in topbar
    };
  };

  this.didMount = function() {
    var documentId = this.getDocumentId();
    if (documentId) {
      // load the document after mounting
      this._loadDocument(this.getDocumentId());
    } else {
      return true;
    }
  };

  this.willReceiveProps = function(newProps) {
    if (newProps.documentId !== this.props.documentId) {
      this.dispose();
      // TODO: Use setState instead?
      this.state = this.getInitialState();
      this._loadDocument(newProps.documentId);
    }
  };

  this.dispose = function() {
    if (this.state.session) {
      this.state.session.off(this);
      this.state.session.dispose();
    }
    this.collabClient.off(this);
    this.collabClient.dispose();
  };

  this.getDocumentId = function() {
    return this.props.documentId;
  };

  this.getChildConfigurator = function(schemaName) {
    var mode = this.props.mode;
    var mproConfigurator = this.context.configurator;
    return mproConfigurator.getConfigurator(mode + '-' + schemaName);
  };

  this._onError = function(err) {
    this.extendState({
      error: {
        type: 'error',
        message: err.name
      }
    });
  };

  // Some hooks
  this._onCollabClientDisconnected = function() {
  };

  this._onCollabClientConnected = function() {
  };

  this._onCollabSessionError = function(/*err*/) {
  };

  this._onCollabSessionSync = function() {
  };

  /*
    Loads a document and initializes a CollabSession
  */
  this._loadDocument = function(documentId, mode) {
    var collabClient = this.collabClient;
    var documentClient = this.context.documentClient;

    documentClient.getDocument(documentId, function(err, docRecord) {
      if (err) {
        this._onError(err);
        return;
      }
      var schemaName = docRecord.data.schema.name;

      var configurator = this.getChildConfigurator(schemaName);
      var article = configurator.createArticle();
      var doc = converter.importDocument(article, docRecord.data);

      var session = new CollabSession(doc, {
        documentId: documentId,
        version: docRecord.version,
        collabClient: collabClient
      });

      // Listen for errors and sync start events for error reporting
      session.on('error', this._onCollabSessionError, this);
      session.on('sync', this._onCollabSessionSync, this);

      // HACK: For debugging purposes
      window.doc = doc;
      window.session = session;

      this.setState({
        configurator: configurator,
        //documentInfo: new DocumentInfo(docRecord),
        session: session
      });
    }.bind(this));
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-edit-document');

    var EditorClass;

    if (this.props.mode === 'viewer') {
      EditorClass = Viewer;
    } else if (this.props.mode === 'editor') {
      //EditorClass = Author;
    }

    // var layout = $$(Layout, {
    //   width: 'large'
    // });
    // Display top-level errors. E.g. when a doc could not be loaded
    // we will display the notification on top level
    if (this.state.error) {
      console.log(this.state.error.message);
      // layout.append($$(Notification, {
      //   type: 'error',
      //   message: this.state.error.message
      // }));
    } else if (!this.props.documentId) {
      el.append(
        $$('div').addClass('no-document').append(
          $$('p').append('click on document to open')
        )
      );
    } else if (this.state.session) {
      el.append(
        $$(EditorClass, {
          configurator: this.state.configurator,
          //documentInfo: this.state.documentInfo,
          documentSession: this.state.session,
          rubrics: this.props.rubrics
        }).ref('documentViewer')
      );
    }

    return el;
  };
};

Component.extend(Loader);

module.exports = Loader;