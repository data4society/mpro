'use strict';

var Component = require('substance/ui/Component');
var CategoriesList = require('./CategoriesList');
var RubricEditor = require('./RubricEditor');

var DocumentSummary = function() {
  DocumentSummary.super.apply(this, arguments);
};

DocumentSummary.Prototype = function() {

  this.render = function($$) {
    //var documentInfo = this.props.documentInfo.props;
    var rubrics = this.props.rubrics;
    //var updatedAt = moment(documentInfo.updatedAt).fromNow();

    var el = $$('div').addClass('sc-document-summary');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }
   
    el.append($$(CategoriesList, {
      rubrics: rubrics,
      editing: this.props.editing
    }).ref('categoriesList'));

    el.append(
      $$(RubricEditor, {
        rubrics: rubrics
      }).ref('rubrics')
    );


    // el.append(
    //   $$('div').addClass('se-item').append(
    //     'Updated ',
    //     updatedAt,
    //     ' by ',
    //     documentInfo.updatedBy
    //   )
    // );
    return el;
  };

  this._openThematicEditor = function() {
    this.refs.rubrics.togglePrompt();
  };
};

Component.extend(DocumentSummary);

module.exports = DocumentSummary;