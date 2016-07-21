'use strict';

var Field = require('./Field');
var ProseEditor = require('substance/packages/prose-editor/ProseEditor');
var ProseImporter = require('substance/packages/prose-editor/ProseArticleImporter');

function Prose() {
  Prose.super.apply(this, arguments);
}

Prose.Prototype = function() {
  
  this.render = function($$) {
    var name = this.getName();
    var value = this.getValue();
    
    var importer = new ProseImporter();
    this.doc = importer.importDocument(value);    
    var el = $$('div')
      .addClass('sc-field sc-field-prose sc-field-' + name);

    var editor = $$(ProseEditor, {
      doc: this.doc
    });

    el.append(editor);

    return el;
  };
};

Field.extend(Prose);

module.exports = Prose;