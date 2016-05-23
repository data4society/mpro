'use strict';

var DocumentClient = require('./MproDocumentClient');
var Err = require('substance/util/Error');
var Header = require('./Header');
var Button = require('substance/ui/Button');
var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var Feed = require('./Feed');
var Filters = require('./Filters');
var ViewDocument = require('./ViewDocument');

function Inbox() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.handleActions({
    'openDocument': this._openDocument
  });
}

Inbox.Prototype = function() {

  this.render = function($$) {
    var userSession = this.props.userSession;
    var el = $$('div').addClass('sc-inbox');

    el.append($$(Header, {
      actions: {
        'newDocument': 'New Document'
      }
    }));

    var layout = $$(Layout, {
      width: 'full',
      textAlign: 'left',
      noPadding: true
    });

    layout.append(
      $$(Feed, this.props).ref('feed'),
      $$(Filters, this.props).ref('filters'),
      $$(ViewDocument, {
        documentId: this.props.route.documentId,
        userSession: userSession,
        mobile: this.props.mobile
      }).ref('viewer')
    );

    el.append(layout);

    return el;
  };

  this._openDocument = function(documentId) {
    var feed = this.refs.feed;
    var viewer = this.refs.viewer;
    
    feed.setActiveItem(documentId);
    viewer.extendProps({
      documentId: documentId
    });
  };

  this._getUserId = function() {
    var authenticationClient = this.context.authenticationClient;
    var user = authenticationClient.getUser();
    return user.userId;
  };

  this._getUserName = function() {
    var authenticationClient = this.context.authenticationClient;
    var user = authenticationClient.getUser();
    return user.name;
  };
};

Component.extend(Inbox);

module.exports = Inbox;