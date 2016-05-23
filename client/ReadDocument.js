'use strict';

var Notification = require('./Notification');
var Layout = require('substance/ui/Layout');
var Button = require('substance/ui/Button');
var Icon = require('substance/ui/FontAwesomeIcon');
var DocumentLoader = require('./DocumentLoader');
var DocumentReader = require('./DocumentReader');
//var RequestEditAccess = require('./RequestEditAccess');

function ReadDocument() {
  DocumentLoader.apply(this, arguments);

  this.handleActions({
    'closeModal': this._closeModal
  });
}

ReadDocument.Prototype = function() {

  this._requestLogin = function() {
    console.log('authenticating now');
    this.extendState({
      requestLogin: true
    });
  };

  this.render = function($$) {
    var userSession = this.props.userSession;
    var el = $$('div').addClass('sc-read-note');

    var layout = $$(Layout, {
      width: 'large'
    });

    // Display top-level errors. E.g. when a doc could not be loaded
    // we will display the notification on top level
    if (this.state.error) {
      layout.append($$(Notification, {
        type: 'error',
        message: this.state.error.message
      }));
    } else if (this.state.session) {
      if (!userSession && !this.props.mobile) {
        layout.append(
          $$(Layout, {
            textAlign: 'center',
            noPadding: true
          }).append(
            $$(Button).addClass('se-new-note-button').append(
              $$(Icon, {icon: 'fa-pencil'}),
              ' Edit'
            ).on('click', this._requestLogin)
          )
        );
      }

      layout.append(
        $$(DocumentReader, {
          mobile: this.props.mobile,
          noteInfo: this.state.noteInfo,
          documentSession: this.state.session
        }).ref('noteReader')
      );
    }

    // if (this.state.requestLogin) {
    //   el.append($$(RequestEditAccess, {
    //     documentId: this.getDocumentId()
    //   }));
    // }

    el.append(layout);
    return el;
  };

  this._closeModal = function() {
    this.extendState({
      requestLogin: undefined
    });
  };
};

DocumentLoader.extend(ReadDocument);

module.exports = ReadDocument;