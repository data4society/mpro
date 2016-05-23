'use strict';

var Component = require('substance/ui/Component');
var TextPropertyEditor = require('substance/ui/TextPropertyEditor');
var DocumentSummary = require('./DocumentSummary');

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
    var metaNode = doc.getDocumentMeta();
    return $$("div").addClass("sc-cover")
      .append(
        // Editable title
        $$(TextPropertyEditor, {
          name: 'title',
          tagName: "div",
          commands: config.titleEditor.commands,
          path: [metaNode.id, "title"],
          editing: this.props.editing || 'full'
        }).addClass('se-title'),
        $$('div').addClass('se-separator'),
        $$('div').addClass('se-authors').append(authors.join(', ')),
        $$(NoteSummary, {
          mobile: this.props.mobile,
          documentInfo: this.props.documentInfo
        })
      );
  };

  this._onDocumentChanged = function(change) {
    // Only rerender if changed happened outside of the title surface.
    // Otherwise we would destroy the current selection
    
    // HACK: update the updatedAt property
    this.props.documentInfo.props.updatedAt = new Date();

    if (change.after && change.after.surfaceId !== 'title') {
      this.rerender();
    }
  };

  this.getDocument = function() {
    return this.props.doc;
  };
};

Component.extend(Cover);

module.exports = Cover;