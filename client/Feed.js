'use strict';

var DocumentClient = require('./MproDocumentClient');
var Err = require('substance/util/Error');
var Header = require('./Header');
var Button = require('substance/ui/Button');
var Component = require('substance/ui/Component');
var FeedItem = require('./FeedItem');

function Feed() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.activeItem = '';
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

    if (documentItems.length > 0) {
      el.append(this.renderFull($$));
    } else {
      el.append(this.renderEmpty($$));
    }
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

    el.append(
      $$('div').addClass('se-intro').append(
        $$('div').addClass('se-document-count').append(
          documentItems.length.toString(),
          ' documents found'
        ),
        $$(Button).addClass('se-new-document-button').append('New Note')
          .on('click', this.send.bind(this, 'newDocument'))
      )
    );

    if (documentItems) {
      documentItems.forEach(function(documentItem) {
        el.append(
          $$(FeedItem, documentItem).ref(documentItem.documentId)
        );
      });
    }
    return el;
  };

  this.setActiveItem = function(documentId) {
    var currentActive = this.activeItem;

    if(currentActive) {
      this.refs[currentActive].extendProps({
        'active': false
      });
    }

    this.refs[documentId].extendProps({
      'active': true
    });

    this.activeItem = documentId;
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

    documentClient.listDocuments(function(err, documents) {
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