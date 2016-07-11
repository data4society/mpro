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

  this.handleActions({
    'loadMore': this._loadMore
  });
}

Feed.Prototype = function() {

  /*
    Load documents list on mount.
  */
  this.didMount = function() {
    this._loadDocuments();
  };

  /*
    Initial state of component, contains:
    - filters: default filters (e.g. not show training documents)
    - perPage: number of documents per page
    - page: default page number
    - order: sort by property
    - direction: order of sorting (desc, asc)
    - documentItems: loaded document items (used internaly)
    - pagination: flag to show/hide pager (used internaly)
    - totalItems: total number of items (used internaly)
  */
  this.getInitialState = function() {
    return {
      filters: {'training': false},
      perPage: 10,
      page: 1,
      order: 'created',
      direction: 'desc',
      documentItems: [],
      pagination: false,
      totalItems: 0
    };
  };

  this.render = function($$) {
    var componentRegistry = this.context.componentRegistry;
    var FeedItem = componentRegistry.get('feedItem');
    var Pager = componentRegistry.get('pager');

    var documentItems = this.state.documentItems;
    var el = $$('div').addClass('sc-feed');

    if (!documentItems) {
      return el;
    }

    el.append(this.renderIntro($$));

    if (documentItems.length > 0) {
      el.append(
        this.renderFull($$, FeedItem),
        $$(Pager, {
          page: this.state.page,
          perPage: this.state.perPage,
          total: this.state.totalItems
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
    var totalItems = this.state.totalItems;
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
    var documentItems = this.state.documentItems;
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

  this.setActiveItem = function(documentId, silent) {
    var currentActive = this.activeItem;

    if(!silent) this.updateUrl(documentId);

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

  this.updateUrl = function(documentId) {
    var urlHelper = this.context.urlHelper;
    urlHelper.writeRoute({section: 'inbox', documentId: documentId});
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

  this._loadMore = function(page) {
    this.extendState({
      page: page,
      pagination: true
    });
    this._loadDocuments();
  };

  this._applyFacets = function(facets) {
    var filters = this.state.filters;
    filters["rubrics @>"] = facets;
    this.extendState({
      filters: filters
    });
    this._loadDocuments();
  };

  /*
    Loads documents
  */
  this._loadDocuments = function() {
    var documentClient = this.context.documentClient;
    var filters = this.state.filters;
    var perPage = this.state.perPage;
    var page = this.state.page;
    var order = this.state.order;
    var direction = this.state.direction;
    var pagination = this.state.pagination;
    var items = [];

    documentClient.listDocuments(
      filters,
      { 
        limit: perPage, 
        offset: perPage * (page - 1),
        order: order + ' ' + direction
      }, 
      function(err, documents) {
        if (err) {
          console.error(err);
          this.setState({
            error: new Error('Feed loading failed')
          });
          return;
        }

        if(pagination) {
          items = concat(this.state.documentItems, documents.records);
        } else {
          items = documents.records;
        }

        this.extendState({
          documentItems: items,
          totalItems: documents.total
        });
      }.bind(this)
    );
  };

};

Component.extend(Feed);

module.exports = Feed;