'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var DocumentSummary = require('./Summary');

var Cover = function() {
  Cover.super.apply(this, arguments);
};

Cover.Prototype = function() {

  this.didMount = function() {
    var doc = this.getDocument();
    doc.on('document:changed', this._onDocumentChanged, this);
  };

  this.dispose = function() {
    var doc = this.getDocument();
    doc.off(this);
  };

  this.render = function($$) {
    var doc = this.getDocument();
    var config = this.context.config;
    var documentInfo = this.props.documentInfo.props;
    var authors = [documentInfo.author || documentInfo.userId];

    authors = authors.concat(documentInfo.collaborators);
   
    var el = $$("div").addClass("sc-cover");

    el.append(
      // Editable title
      $$(TextPropertyEditor, {
        name: 'title',
        path: ["meta", "title"],
        disabled: this.props.editing !== 'full'
      }).addClass('se-title'),
      $$('div').addClass('se-separator'),
      $$(DocumentSummary, {
        mobile: this.props.mobile,
        documentInfo: this.props.documentInfo,
        rubrics: this.props.rubrics,
        editing: this.props.editing || 'full'
      })
    );

    return el;
  };

  this._onDocumentChanged = function(change) {
    var doc = this.props.doc;
    var meta = doc.get('meta');
    var documentInfo = this.props.documentInfo;
    var documentId = documentInfo.props.documentId;
    
    // HACK: update the updatedAt property
    documentInfo.props.updatedAt = new Date();
    documentInfo.props.meta = {title: meta.title, rubrics: meta.rubrics};

    // if (change.after.surfaceId == 'title') {
    //   var title = doc.get(['meta', 'title']);
    //   this.send('updateListTitle', documentId, title);
    // }
  };

  this.getDocument = function() {
    return this.props.doc;
  };
};

Component.extend(Cover);

module.exports = Cover;