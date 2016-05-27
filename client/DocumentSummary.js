'use strict';

var Component = require('substance/ui/Component');
var CategoriesList = require('./CategoriesList');
var ThematicEditor = require('./ThematicEditor');

var DocumentSummary = function() {
  DocumentSummary.super.apply(this, arguments);
};

DocumentSummary.Prototype = function() {

  this.render = function($$) {
    //var documentInfo = this.props.documentInfo.props;
    var thematics = this.props.thematics;
    //var updatedAt = moment(documentInfo.updatedAt).fromNow();

    var el = $$('div').addClass('sc-document-summary');
    if (this.props.mobile) {
      el.addClass('sm-mobile');
    }
   
    el.append($$(CategoriesList, {
      thematics: thematics,
      editing: this.props.editing
    }).ref('categoriesList'));

    el.append(
      $$(ThematicEditor, {
        thematics: thematics
      }).ref('thematics')
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
    this.refs.thematics.togglePrompt();
  };
};

Component.extend(DocumentSummary);

module.exports = DocumentSummary;