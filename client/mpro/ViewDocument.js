'use strict';

//var Notification = require('./Notification');
var DocumentLoader = require('../shared/DocumentLoader');
var DocumentViewer = require('./DocumentViewer');

function ViewDocument() {
  DocumentLoader.apply(this, arguments);
}

ViewDocument.Prototype = function() {

  this.didMount = function() {
    var documentId = this.getDocumentId();
    if (documentId) {
      // load the document after mounting
      this._loadDocument(this.getDocumentId());
    } else {
      return true;
    }
  };

  this.render = function($$) {
    var el = $$('div').addClass('sc-view-document');

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
        $$(DocumentViewer, {
          mobile: this.props.mobile,
          documentInfo: this.state.documentInfo,
          documentSession: this.state.session,
          rubrics: this.state.rubrics
        }).ref('documentViewer')
      );
    }

    // if (this.state.requestLogin) {
    //   el.append($$(RequestEditAccess, {
    //     documentId: this.getDocumentId()
    //   }));
    // }

    return el;
  };
};

DocumentLoader.extend(ViewDocument);

module.exports = ViewDocument;