'use strict';

var extend = require('lodash/extend');
var DocumentClient = require('../clients/MproDocumentClient');
var Header = require('../shared/Header');
var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var Err = require('substance/util/Error');
var TrainingList = require('./TrainingList');
var Filters = require('../shared/Filters');
var EditDocument = require('./EditDocument');
var Rubric = require('../../models/rubric/Rubric');

function Configurator() {
  Component.apply(this, arguments);

  var config = this.context.config;
  this.documentClient = new DocumentClient({
    httpUrl: config.documentServerUrl || 'http://'+config.host+':'+config.port+'/api/documents/'
  });

  this.handleActions({
    'openDocument': this._openDocument,
    'updateListTitle': this._updateTitle,
    'updateListRubrics': this._updateRubrics,
    'filterFacets': this._filterFacets
  });
}

Configurator.Prototype = function() {

  this.didMount = function() {
    this._loadRubrics();
  };

  this.render = function($$) {
    var userSession = this.props.userSession;
    var el = $$('div').addClass('sc-inbox');

    el.append($$(Header, {
      actions: {
        'home': 'Inbox',
        'import': 'Import'
      }
    }));

    var layout = $$(Layout, {
      width: 'full',
      textAlign: 'left',
      noPadding: true
    });

    layout.append(
      $$(TrainingList, extend({}, this.props, {rubrics: this.state.rubrics})).ref('list'),
      $$(Filters, extend({}, this.props, {rubrics: this.state.rubrics, training: true})).ref('filters'),
      $$(EditDocument, {
        documentId: this.props.route.documentId,
        rubrics: this.state.rubrics,
        userSession: userSession,
        mobile: this.props.mobile
      }).ref('editor')
    );

    el.append(layout);

    return el;
  };

  this._openDocument = function(documentId) {
    var list = this.refs.list;
    var editor = this.refs.editor;
    
    list.setActiveItem(documentId);
    editor.extendProps({
      documentId: documentId
    });
  };

  this._updateTitle = function(documentId, title) {
    var list = this.refs.list;
    list.updateTitle(documentId, title);
  };
  
  this._updateRubrics = function(documentId, rubrics) {
    var list = this.refs.list;
    list.updateRubrics(documentId, rubrics);
  };

  this._filterFacets = function(facets) {
    var list = this.refs.list;
    list._applyFacets(facets);
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

Component.extend(Configurator);

module.exports = Configurator;