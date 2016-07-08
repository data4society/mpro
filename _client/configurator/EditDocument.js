'use strict';

//var Collaborators = require('./Collaborators');
//var Notification = require('./Notification');
var DocumentLoader = require('../shared/DocumentLoader');
var DocumentWriter = require('./DocumentWriter');
var inBrowser = require('substance/util/inBrowser');

function EditDocument() {
  DocumentLoader.apply(this, arguments);
}

EditDocument.Prototype = function() {
  var _super = EditDocument.super.prototype;

  this.didMount = function() {
    var documentId = this.getDocumentId();
    if (documentId) {
      // load the document after mounting
      this._loadDocument(this.getDocumentId());
    } else {
      return true;
    }
  };

  this.dispose = function() {
    _super.dispose.call(this);

    if (inBrowser) {
      document.body.classList.remove('sm-fixed-layout');  
    }
  };

  this.render = function($$) {
    //var notification = this.state.notification;
    var el = $$('div').addClass('sc-edit-document');
    var main = $$('div');

    // Notification overrules collaborators
    // if (notification) {
    //   header.outlet('content').append(
    //     $$(Notification, notification)
    //   );
    // } else if (this.state.session) {
    //   header.outlet('content').append(
    //     $$(Collaborators, {
    //       session: this.state.session
    //     })
    //   );
    // }

    // Main content
    // --------------

    // Display top-level errors. E.g. when a doc could not be loaded
    // we will display the notification on top level
    if (this.state.error) {
      console.log(this.state.error.message);
      // main = $$('div').append(
      //   $$(Notification, {
      //     type: 'error',
      //     message: this.state.error.message
      //   })
      // );
    } else if (!this.props.documentId) {
      el.append(
        $$('div').addClass('no-document').append(
          $$('p').append('click on document to open')
        )
      );
    } else if (this.state.session) {
      main = $$(DocumentWriter, {
        documentInfo: this.state.documentInfo,
        documentSession: this.state.session,
        rubrics: this.props.rubrics
      }).ref('documentEditor');
    }

    el.append(main);
    return el;
  };


  this._onCollabClientDisconnected = function() {
    this.extendState({
      notification: {
        type: 'error',
        message: 'Connection lost! After reconnecting, your changes will be saved.'
      }
    });
  };

  this._onCollabClientConnected = function() {
    this.extendState({
      notification: null
    });
  };

  /*
    Extract error message for error object. Also consider first cause.
  */
  this._onCollabSessionError = function(err) {
    var message = [
      this.i18n.t(err.name)
    ];
    if (err.cause) {
      message.push(this.i18n.t(err.cause.name));
    }
    this.extendState({
      notification: {
        type: 'error',
        message: message.join(' ')
      }
    });
  };

  this._onCollabSessionSync = function() {
    if (this.state.notification) {
      // Unset notification (error message)
      this.extendState({
        notification: null
      });
    }
  };
};

DocumentLoader.extend(EditDocument);

module.exports = EditDocument;