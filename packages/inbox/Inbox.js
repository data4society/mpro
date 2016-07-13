'use strict';

var extend = require('lodash/extend');
var Component = require('substance/ui/Component');
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
    'openDocument': this._openDocument
  });
}

Inbox.Prototype = function() {

  this.render = function($$) {
    var componentRegistry = this.context.componentRegistry;
    var Header = componentRegistry.get('header');
    var Feed = componentRegistry.get('feed');
    var Filters = componentRegistry.get('filters');
    var Loader = componentRegistry.get('loader');

    var el = $$('div').addClass('sc-inbox');

    el.append($$(Header, {
      actions: {
        'configurator': this.getLabel('configurator-menu')
      }
    }));

    el.append(
      $$(DoubleSplitPane, {splitType: 'vertical', sizeA: '300px', sizeB: '40%'}).append(
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
          mode: 'viewer', // For debugging purposes
          userSession: {sessionToken: 'testusertoken'} // For debugging purposes
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

};

AbstractFeedLoader.extend(Inbox);

module.exports = Inbox;