'use strict';

var filter = require('lodash/filter');
var concat = require('lodash/concat');
var ListScrollPane = require('../common/ListScrollPane');
var DoubleSplitPane = require('../common/DoubleSplitPane');
var AbstractFeedLoader = require('../common/AbstractFeedLoader');

/*
  Represents Configurator page.

  Component splits into three parts:
  - Filters
  - Feed
  - Document Viewer
*/
function Configurator() {
  AbstractFeedLoader.apply(this, arguments);

  this.handleActions({
    'loadMore': this._loadMore,
    'openDocument': this._openDocument,
    'newDocument': this._newDocument,
    'deleteDocument': this._deleteDocument,
    'notify': this._notify,
    'connectSession': this._connectSession
  });
}

Configurator.Prototype = function() {

  this.getInitialState = function() {
    return {
      filters: {'training': true, 'rubrics @>': []},
      perPage: 10,
      order: 'created',
      direction: 'desc',
      documentId: this.props.documentId,
      documentItems: [],
      pagination: false,
      totalItems: 0,
      rubrics: {},
      addNew: true
    };
  };

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

    var el = $$('div').addClass('sc-configurator');

    var header = $$(Header, {
      actions: {
        'inbox': this.getLabel('inbox-menu'),
        'import': this.getLabel('import-menu')
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
          $$(Feed, this.state).ref('feed')
        ),
        $$(Loader, {
          documentId: this.state.documentId,
          rubrics: this.state.rubrics,
          mode: 'editor',
          userSession: authenticationClient.getSession()
        }).ref('loader')
      )
    );

    return el;
  };

  this._openDocument = function(documentId) {
    var loader = this.refs.loader;
    var feed = this.refs.feed;

    this.extendState({documentId: documentId});
    feed.setActiveItem(documentId);
    this.updateUrl(documentId);
    
    loader.extendProps({
      documentId: documentId
    });
  };

  /*
    Creates a new training document
  */
  this._newDocument = function() {
    var documentClient = this.context.documentClient;
    var authenticationClient = this.context.authenticationClient;
    var user = authenticationClient.getUser();
    var userId = user.user_id;

    documentClient.createDocument({
      schemaName: 'mpro-tng',
      // TODO: Find a way not to do this statically
      // Actually we should not provide the userId
      // from the client here.
      info: {
        title: 'Untitled Article',
        abstract: '',
        source_type: 'mpro',
        userId: userId,
        training: true,
        rubrics: [],
        entities: [],
        accepted: false
      }
    }, function(err, result) {
      var documentItems = concat(result, this.state.documentItems);
      var totalItems = parseInt(this.state.totalItems, 10) + 1;
      this.extendState({
        documentItems: documentItems,
        totalItems: totalItems
      });
      this._openDocument(result.documentId);
    }.bind(this));
  };

  /*
    Removes a document
  */

  this._deleteDocument = function(documentId) {
    var documentClient = this.context.documentClient;
    documentClient.deleteDocument(documentId, function(/*err, result*/) {
      var documentItems = this.state.documentItems;
      var cleanedItems = filter(documentItems, function(i) { 
        return i.documentId !== documentId;
      });
      var totalItems = parseInt(this.state.totalItems, 10) - 1;
      this.extendState({
        documentId: '',
        documentItems: cleanedItems,
        totalItems: totalItems
      });
    }.bind(this));
  };

  this.updateUrl = function(documentId) {
    var urlHelper = this.context.urlHelper;
    urlHelper.writeRoute({page: 'configurator', documentId: documentId});
  };

  this._loadMore = function() {
    this.extendState({
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

AbstractFeedLoader.extend(Configurator);

module.exports = Configurator;