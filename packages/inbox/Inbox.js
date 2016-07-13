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
    var Viewer = componentRegistry.get('viewer');

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
        $$(Viewer, {
          documentId: this.props.documentId,
          rubrics: this.state.rubrics,
          userSession: {sessionToken: 'testusertoken'} // For debugging purposes
        }).ref('viewer')
      )
    );

    return el;
  };

  this._openDocument = function(documentId) {
    var viewer = this.refs.viewer;
    
    viewer.extendProps({
      documentId: documentId
    });
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