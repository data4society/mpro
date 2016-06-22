'use strict';

var concat = require('lodash/concat');
var DocumentClient = require('../clients/MproDocumentClient');
var Err = require('substance/util/Error');
var Component = require('substance/ui/Component');
var Rubric = require('../../models/rubric/Rubric');
var FeedItem = require('./FeedItem');
var Pager = require('../shared/Pager');

function Feed() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.activeItem = this.props.route.documentId;

  this.handleActions({
    'loadMore': this._loadMore
  });
}

Feed.Prototype = function() {

  this.didMount = function() {
    this._loadRubrics();
    this._loadDocuments();
  };

  this.willReceiveProps = function() {
    //this._loadDocuments();
  };

  this.getInitialState = function() {
    return {
      filters: {'training': false},
      perPage: 10,
      page: 1,
      order: 'created',
      direction: 'desc',
      documentItems: [],
      totalItems: 0
    };
  };

  this.render = function($$) {
    var documentItems = this.state.documentItems;
    var el = $$('div').addClass('sc-feed');

    if (!documentItems) {
      return el;
    }

    el.append(this.renderIntro($$));

    if (documentItems.length > 0) {
      el.append(
        this.renderFull($$),
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

  this.renderIntro = function($$) {
    var totalItems = this.state.totalItems;
    var el = $$('div').addClass('se-intro');

    el.append(
      $$('div').addClass('se-document-count').append(
        totalItems,
        ' documents found'
      )
    );

    return el;
  };

  this.renderEmpty = function($$) {
    var el = $$('div').addClass('se-feed-empty');

    el.append(
      $$('h1').html(
        'No results'
      ),
      $$('p').html('We have no documents matching your query')
    );

    return el;
  };

  this.renderFull = function($$) {
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
            rubrics: this.state.rubrics
          }).ref(documentItem.documentId)
        );
      }.bind(this));
    }
    return el;
  };

  this.setActiveItem = function(documentId) {
    var currentActive = this.activeItem;

    this.updateUrl(documentId);

    if(currentActive) {
      this.refs[currentActive].extendProps({
        'active': false
      });
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

  this._loadMore = function(page) {
    this.extendState({
      page: page
    });
    this._loadDocuments();
  };

  /*
    Loads documents
  */
  this._loadDocuments = function() {
    var documentClient = this.documentClient;
    var filters = this.state.filters;
    var perPage = this.state.perPage;
    var page = this.state.page;
    var order = this.state.order;
    var direction = this.state.direction;
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
          this.setState({
            error: new Err('Feed.LoadingError', {
              message: 'Documents could not be loaded.',
              cause: err
            })
          });
          console.error('ERROR', err);
          return;
        }

        items = concat(this.state.documentItems, documents.records);

        this.extendState({
          documentItems: items,
          totalItems: documents.total
        });
      }.bind(this)
    );
  };

  this._loadRubrics = function() {
    var documentClient = this.context.documentClient;

    documentClient.listRubrics({}, {}, function(err, result) {
      if (err) {
        this.setState({
          error: new Err('Feed.LoadingError', {
            message: 'Rubrics could not be loaded.',
            cause: err
          })
        });
        console.error('ERROR', err);
        return;
      }

      var rubrics = new Rubric(false, result.records);
      this.extendState({
        rubrics: rubrics.tree
      });
    }.bind(this));
  };
};

Component.extend(Feed);

module.exports = Feed;