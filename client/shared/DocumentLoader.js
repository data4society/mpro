'use strict';

var CollabSession = require('substance/collab/CollabSession');
var JSONConverter = require('substance/model/JSONConverter');
var CollabClient = require('substance/collab/CollabClient');
var WebSocketConnection = require('substance/collab/WebSocketConnection');
var Component = require('substance/ui/Component');
var Article = require('../../models/article/Article');
var Vk = require('../../models/vk/Vk');
var DocumentInfo = require('./DocumentInfo');
var converter = new JSONConverter();

/*
  Used as a scaffold for EditDocument and ReadDocument components

  Mainly responsible for managing life cycle and data loading
*/
function RealtimeDocument() {
  Component.apply(this, arguments);

  var config = this.context.config;

  this.conn = new WebSocketConnection({
    wsUrl: config.wsUrl || 'ws://'+config.host+':'+config.port
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

RealtimeDocument.Prototype = function() {

  this.getInitialState = function() {
    return {
      session: null, // CollabSession will be stored here, if null indicates we are in loading state
      error: null, // used to display error messages e.g. loading of document failed
      notification: null //used to display status messages in topbar
    };
  };

  this.getDocumentId = function() {
    return this.props.documentId;
  };

  this.didMount = function() {
    // load the document after mounting
    this._loadDocument(this.getDocumentId());
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

  this._onError = function(err) {
    this.extendState({
      error: {
        type: 'error',
        message: this.i18n.t(err.name)
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
  this._loadDocument = function(documentId) {
    var collabClient = this.collabClient;
    var documentClient = this.context.documentClient;

    documentClient.getDocument(documentId, function(err, docRecord) {
      if (err) {
        this._onError(err);
        return;
      }
      var schema = docRecord.data.schema;
      var doc;

      if (schema.name == 'mpro-article') {
        doc = new Article();
      } else if (schema.name == 'mpro-vk') {
        doc = new Vk();
      }

      doc = converter.importDocument(doc, docRecord.data);
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
        documentInfo: new DocumentInfo(docRecord),
        session: session
      });
    }.bind(this));
  };
};

Component.extend(RealtimeDocument);

module.exports = RealtimeDocument;