'use strict';

var Err = require('substance/util/Error');
var Button = require('substance/ui/Button');
var Rubric = require('../models/rubric/Rubric');
var Feed = require('./Feed');
var ListItem = require('./ListItem');

function TrainingList() {
  Feed.apply(this, arguments);
}

TrainingList.Prototype = function() {

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

  /*
    Loads documents
  */
  this._loadDocuments = function() {
    var self = this;
    var documentClient = this.documentClient;
    //var userId = this._getUserId();
    this._loadRubrics();
    documentClient.listDocuments({'training': true}, {}, function(err, documents) {
      if (err) {
        this.setState({
          error: new Err('TrainingList.LoadingError', {
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

Feed.extend(TrainingList);

module.exports = TrainingList;