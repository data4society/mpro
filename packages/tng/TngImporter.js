'use strict';

var sanitizeHtml = require('sanitize-html');
var HTMLImporter = require('substance/model/HTMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var each = require('lodash/each');
var find = require('lodash/find');
var Article = require('./Article');
var schema = Article.schema;

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter')
];

function TngImporter() {
  TngImporter.super.call(this, {
    schema: schema,
    converters: converters,
    DocumentClass: Article
  });
}

TngImporter.Prototype = function() {

  this.importDocument = function(html, source) {

    html = html.replace(/&#13;/g, '').replace(/<br ?\/?>|<\/p>|<\/div>/g, '\n');

    var clean = sanitizeHtml(html, {
      allowedTags: [ /*'p',*/ 'b', 'i', 'em', 'strong', 'a' ],
      allowedAttributes: {
        'a': [ 'href' ]
      }
    });

    clean = clean.split('\n');

    for (var i = 0; i < clean.length; i++) {
      clean[i] = clean[i].trim();
      if (clean[i] === "") {         
        clean.splice(i, 1);
        i--;
      }
    }

    clean = clean.join('</p><p>');
    clean = "<p>" + clean + "</p>";

    this.reset();
    var parsed = DefaultDOMElement.parseHTML(clean);
    this.convertDocument(parsed);
    var doc = this.generateDocument();
    // Create document metadata
    this.convertMeta(doc, source);
    return doc;
  };

  this.convertDocument = function(els) {
    if (!els.length) els = [els];
    this.convertContainer(els, 'body');
  };

  this.convertMeta = function(doc, source) {
    var meta = source.meta;

    // Hack, should be replaced
    var source_type = source.guid.indexOf('vk.com') > -1 ? 'vk' : 'article'; 
    var abstract = source.doc_source.substr(0, source.doc_source.indexOf('<br>'));
    abstract = this.truncate(abstract, 200, true);

    if(meta.abstract) abstract = meta.abstract;

    doc.create({
      id: 'meta',
      type: 'meta',
      title: source.title || '',
      rubrics: source.rubric_ids,
      source_type: source_type,
      entities: [],
      abstract: abstract,
      accepted: false
    });
  };

  this.truncate = function(string, n, useWordBoundary) {
    var isTooLong = string.length > n,
        s_ = isTooLong ? string.substr(0,n-1) : string;
        s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '&hellip;' : s_;
  };
};

// Expose converters so we can reuse them in ArticleHtmlExporter
TngImporter.converters = converters;

HTMLImporter.extend(TngImporter);
module.exports = TngImporter;