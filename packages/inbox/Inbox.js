'use strict';

var extend = require('lodash/extend');
var ListScrollPane = require('../common/ListScrollPane');
var DoubleSplitPane = require('../common/DoubleSplitPane');
var AbstractFeedLoader = require('../common/AbstractFeedLoader');

/*
  Represents Inbox page.

  Component splits into three parts:
  - Filters
  - Feed
  - Document Viewer
*/
function Inbox() {
  AbstractFeedLoader.apply(this, arguments);

  this.handleActions({
    'loadMore': this._loadMore,
    'openDocument': this._openDocument,
    'notify': this._notify,
    'connectSession': this._connectSession
  });
}

Inbox.Prototype = function() {

  this.render = function($$) {
    var authenticationClient = this.context.authenticationClient;
    var componentRegistry = this.context.componentRegistry;
    var Header = componentRegistry.get('header');
    var Feed = componentRegistry.get('feed');
    var Filters = componentRegistry.get('filters');
    var Loader = componentRegistry.get('loader');
    var Notification = componentRegistry.get('notification');
    var Collaborators = componentRegistry.get('collaborators');
    var LoginStatus = componentRegistry.get('login-status');

    var el = $$('div').addClass('sc-inbox');

    var header = $$(Header, {
      actions: {
        'configurator': this.getLabel('configurator-menu')
      }
    });

    header.outlet('content').append(
      $$(LoginStatus),
      $$(Notification, {}).ref('notification'),
      $$(Collaborators, {}).ref('collaborators')
    );

    el.append(
      header,
      $$(DoubleSplitPane, {splitType: 'vertical', sizeA: '300px', sizeB: '38%'}).append(
        $$(Filters, {rubrics: this.state.rubrics}).ref('filters'),
        $$(ListScrollPane, {
          scrollbarType: 'substance',
          scrollbarPosition: 'left'
        }).append(
          $$(Feed, extend({}, this.props, this.state)).ref('feed')
        ),
        $$(Loader, {
          documentId: this.props.documentId,
          rubrics: this.state.rubrics,
          mode: 'viewer',
          userSession: authenticationClient.getSession()
        }).ref('loader')
      )
    );

    return el;
  };

  this._openDocument = function(documentId) {
    var loader = this.refs.loader;
    var feed = this.refs.feed;

    feed.setActiveItem(documentId);

    this.updateUrl(documentId);
    
    loader.extendProps({
      documentId: documentId
    });
  };

  this.updateUrl = function(documentId) {
    var urlHelper = this.context.urlHelper;
    urlHelper.writeRoute({page: 'inbox', documentId: documentId});
  };

  this._loadMore = function(page) {
    this.extendState({
      page: page,
      pagination: true
    });
    this._loadDocuments();
  };

  this._notify = function(msg) {
    this.refs.notification.extendProps(msg);
  };

  this._connectSession = function(session) {
    this.refs.collaborators.extendProps(session);
  };

};

AbstractFeedLoader.extend(Inbox);

module.exports = Inbox;