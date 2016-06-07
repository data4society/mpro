'use strict';

var DocumentClient = require('../clients/MproDocumentClient');
var Header = require('../shared/Header');
var Layout = require('substance/ui/Layout');
var Component = require('substance/ui/Component');
var TrainingList = require('./TrainingList');
var Filters = require('../shared/Filters');
var EditDocument = require('./EditDocument');

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
  });
}

Configurator.Prototype = function() {

  this.render = function($$) {
    var userSession = this.props.userSession;
    var el = $$('div').addClass('sc-inbox');

    el.append($$(Header, {
      actions: {
        'home': 'Inbox'
      }
    }));

    var layout = $$(Layout, {
      width: 'full',
      textAlign: 'left',
      noPadding: true
    });

    layout.append(
      $$(TrainingList, this.props).ref('list'),
      $$(Filters, this.props).ref('filters'),
      $$(EditDocument, {
        documentId: this.props.route.documentId,
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
};

Component.extend(Configurator);

module.exports = Configurator;