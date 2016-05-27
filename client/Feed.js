'use strict';

var DocumentClient = require('./MproDocumentClient');
var Err = require('substance/util/Error');
var Component = require('substance/ui/Component');
var FeedItem = require('./FeedItem');

function Feed() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.activeItem = this.props.route.documentId;
}

Feed.Prototype = function() {

  this.didMount = function() {
    this._loadDocuments();
  };

  this.willReceiveProps = function() {
    this._loadDocuments();
  };

  this.render = function($$) {
    var documentItems = this.state.documentItems;
    var el = $$('div').addClass('sc-feed');

    if (!documentItems) {
      return el;
    }

    el.append(this.renderIntro($$));

    if (documentItems.length > 0) {
      el.append(this.renderFull($$));
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
          $$(FeedItem, {document: documentItem, active: active}).ref(documentItem.documentId)
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

  /*
    Loads documents
  */
  this._loadDocuments = function() {
    var self = this;
    var documentClient = this.documentClient;
    //var userId = this._getUserId();

    documentClient.listDocuments({'training': false}, {}, function(err, documents) {
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

      self.extendState({
        documentItems: documents.records,
        totalItems: documents.total
      });
    }.bind(this));
  };
};

Component.extend(Feed);

module.exports = Feed;