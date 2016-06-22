'use strict';

var Button = require('substance/ui/Button');
var Feed = require('../mpro/Feed');
var ListItem = require('./ListItem');

function TrainingList() {
  Feed.apply(this, arguments);
}

TrainingList.Prototype = function() {

  this.getInitialState = function() {
    return {
      filters: {'training': true},
      perPage: 10,
      page: 1,
      order: 'created',
      direction: 'desc',
      documentItems: [],
      totalItems: 0
    };
  };

  this.renderIntro = function($$) {
    var totalItems = this.state.totalItems;
    var el = $$('div').addClass('se-intro');

    el.append(
      $$('div').addClass('se-document-count').append(
        totalItems,
        ' documents found'
      ),
      $$(Button).addClass('se-new-document-button').append('New Document')
        .on('click', this.send.bind(this, 'newTrainingDocument'))
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
          $$(ListItem, {
            document: documentItem,
            active: active,
            rubrics: this.state.rubrics
          }).ref(documentItem.documentId)
        );
      }.bind(this));
    }
    return el;
  };

  this.updateTitle = function(documentId, title) {
    if(this.refs[documentId]) {
      var document = this.refs[documentId].props.document;
      document.title = title;
      this.refs[documentId].extendProps({
        'document': document
      });
    }
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
    urlHelper.writeRoute({section: 'configurator', documentId: documentId});
  };
};

Feed.extend(TrainingList);

module.exports = TrainingList;