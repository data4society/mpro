'use strict';

var extend = require('lodash/extend');
var DocumentClient = require('../clients/MproDocumentClient');
var Header = require('../shared/Header');
var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var Err = require('substance/util/Error');
var Feed = require('./Feed');
var Filters = require('../shared/Filters');
var ViewDocument = require('./ViewDocument');
var Rubric = require('../../models/rubric/Rubric');

function Inbox() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.handleActions({
    'openDocument': this._openDocument,
    'updateListRubrics': this._updateRubrics,
    'filterFacets': this._filterFacets
  });
}

Inbox.Prototype = function() {

  this.didMount = function() {
    this._loadRubrics();
  };

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
      $$(Feed, extend({}, this.props, {rubrics: this.state.rubrics})).ref('feed'),
      $$(Filters, extend({}, this.props, {rubrics: this.state.rubrics, training: false})).ref('filters'),
      $$(ViewDocument, {
        documentId: this.props.route.documentId,
        rubrics: this.state.rubrics,
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

  this._filterFacets = function(facets) {
    var feed = this.refs.feed;
    feed._applyFacets(facets);
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

Component.extend(Inbox);

module.exports = Inbox;