'use strict';

var CollabSession = require('substance/collab/CollabSession');
var JSONConverter = require('substance/model/JSONConverter');
var CollabClient = require('substance/collab/CollabClient');
var WebSocketConnection = require('substance/collab/WebSocketConnection');
var Component = require('substance/ui/Component');
var isEmpty = require('lodash/isEmpty');
var Info = require('./Info');
var Viewer = require('../viewer/Viewer');
var Editor = require('../editor/Editor');
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
    };
  };

  this.didMount = function() {
    var documentId = this.getDocumentId();
    if (!isEmpty(documentId)) {
      // load the document after mounting
      this._loadDocument(this.getDocumentId());
    } else {
      return true;
    }
  };

  this.willReceiveProps = function(newProps) {
    if (newProps.documentId !== this.props.documentId && !isEmpty(newProps.documentId)) {
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

  this._onCollabClientDisconnected = function() {
    this.send('notify', {type: 'error', message: 'Connection lost! After reconnecting, your changes will be saved.'});
  };

  this._onCollabClientConnected = function() {
    this.send('notify', null);
  };

  /*
    Extract error message for error object. Also consider first cause.
  */
  this._onCollabSessionError = function(err) {
    var message = [
      err.name
    ];
    if (err.cause) {
      message.push(err.cause.name);
    }
    this.send('notify', {type: 'error', message: message.join(' ')});
  };

  this._onCollabSessionSync = function() {
    this.send('notify', null);
  };

  /*
    Loads a document and initializes a CollabSession
  */
  this._loadDocument = function(documentId) {
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
        documentInfo: new Info(docRecord),
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
      EditorClass = Editor;
    }

    if (this.state.error) {
      this.send('notify', {type: 'error', message: this.state.error.message});
    } else if (isEmpty(this.props.documentId)) {
      el.append(
        $$('div').addClass('no-document').append(
          $$('p').append(this.getLabel('no-document'))
        )
      );
    } else if (this.state.session) {
      this.send('connectSession', this.state.session);
      el.append(
        $$(EditorClass, {
          configurator: this.state.configurator,
          documentInfo: this.state.documentInfo,
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