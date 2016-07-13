'use strict';

var concat = require('lodash/concat');
var isEmpty = require('lodash/isEmpty');
var Component = require('substance/ui/Component');

/*
  Incoming Documents Feed.

  Component represents list of incoming documents.
*/
function Feed() {
  Component.apply(this, arguments);

  var route = this.context.urlHelper.getRoute();
  this.activeItem = route.documentId;
}

Feed.Prototype = function() {

  this.render = function($$) {
    var componentRegistry = this.context.componentRegistry;
    var FeedItem = componentRegistry.get('feedItem');
    var Pager = componentRegistry.get('pager');

    var documentItems = this.props.documentItems;
    var el = $$('div').addClass('sc-feed');

    if (!documentItems) {
      return el;
    }

    el.append(this.renderIntro($$));

    if (documentItems.length > 0) {
      el.append(
        this.renderFull($$, FeedItem),
        $$(Pager, {
          page: this.props.page,
          perPage: this.props.perPage,
          total: this.props.totalItems
        })
      );
    } else {
      el.append(this.renderEmpty($$));
    }
    return el;
  };

  /*
    Intro.

    Contains counter of founded documents.
  */
  this.renderIntro = function($$) {
    var totalItems = this.props.totalItems;
    var el = $$('div').addClass('se-intro');
    var label = this.getLabel('counter' + this._getNumEnding(totalItems));
    label = totalItems > 0 ? totalItems + ' ' + label : label;

    el.append(
      $$('div').addClass('se-document-count').append(
        label
      )
    );

    return el;
  };

  /*
    Empty feed.

    Contains legend for empty list.
  */
  this.renderEmpty = function($$) {
    var el = $$('div').addClass('se-feed-empty');

    el.append(
      $$('p').append(this.getLabel('empty-feed'))
    );

    return el;
  };

  /*
    Non-empty feed.

    Contains Feed Items.
  */
  this.renderFull = function($$, FeedItem) {
    var documentItems = this.props.documentItems;
    var el = $$('div').addClass('se-feed-not-empty');

    if (documentItems) {
      documentItems.forEach(function(documentItem) {
        var active = false;
        if(documentItem.documentId === this.activeItem) {
          active = true;
        }
        el.append(
          $$(FeedItem, {
            document: documentItem,
            active: active,
            rubrics: this.props.rubrics
          }).ref(documentItem.documentId)
        );
      }.bind(this));
    }
    return el;
  };

  this.setActiveItem = function(documentId) {
    var currentActive = this.activeItem;

    if(currentActive && !isEmpty(this.refs)) {
      if(this.refs[currentActive]) {
        this.refs[currentActive].extendProps({
          'active': false
        });
      }
    }

    if(this.refs[documentId]) {
      this.refs[documentId].extendProps({
        'active': true
      });
    }

    this.activeItem = documentId;
  };

  this.updateRubrics = function(documentId, rubrics) {
    if(this.refs[documentId]) {
      var document = this.refs[documentId].props.document;
      document.meta.rubrics = rubrics;
      this.refs[documentId].extendProps({
        'document': document
      });
    }
  };

  /*
    Return specific number of word ending set.
    - 0 is for 0 items
    - 1 is for 1 item
    - 4 is for 4 items
    - 5 is for 5 items
  */
  this._getNumEnding = function(number) {
    var endingSet, i;
    if(number === 0) return 0;
    number = number % 100;
    if (number>=11 && number<=19) {
      endingSet = 5;
    }
    else {
      i = number % 10;
      switch (i) {
        case (1): endingSet = 1;
          break;
        case (2):
        case (3):
        case (4): endingSet = 4;
          break;
        default: endingSet = 5;
      }
    }
    return endingSet;
  };

};

Component.extend(Feed);

module.exports = Feed;