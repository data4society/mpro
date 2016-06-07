'use strict';

var DocumentClient = require('../clients/MproDocumentClient');
var Header = require('../shared/Header');
var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var Feed = require('./Feed');
var Filters = require('../shared/Filters');
var ViewDocument = require('./ViewDocument');

function Inbox() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.handleActions({
    'openDocument': this._openDocument,
    'updateListRubrics': this._updateRubrics
  });
}

Inbox.Prototype = function() {

  this.render = function($$) {
    var userSession = this.props.userSession;
    var el = $$('div').addClass('sc-inbox');

    el.append($$(Header, {
      actions: {
        'configurator': 'Configurator'
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

  this._updateRubrics = function(documentId, rubrics) {
    var feed = this.refs.feed;
    feed.updateRubrics(documentId, rubrics);
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