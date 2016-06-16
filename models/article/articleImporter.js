'use strict';

var sanitizeHtml = require('sanitize-html');
var HTMLImporter = require('substance/model/HTMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var map = require('lodash/map');
var articleSchema = require('./articleSchema');
var Article = require('./Article');

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter')
];

function ArticleImporter() {
  ArticleImporter.super.call(this, {
    schema: articleSchema,
    converters: converters,
    DocumentClass: Article
  });
};

ArticleImporter.Prototype = function() {

  this.importDocument = function(html, source) {

    var clean = sanitizeHtml(html, {
      allowedTags: [ 'p', 'b', 'i', 'em', 'strong', 'a' ],
      allowedAttributes: {
        'a': [ 'href' ]
      }
    });
    // Preprocess record
    // Replace double <br> with paragraph
    //html = "<p>" + html + "</p>";
    //html = html.replace(/<br>/gi, "</p><p>");
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
    var publisher = meta.publisher;
    var published = new Date(source.published_date);

    doc.create({
      id: 'meta',
      type: 'meta',
      title: source.title,
      source: source.guid,
      published: published.toJSON(),
      rubrics: source.rubric_ids,
      entities: [],
      abstract: meta.abstract,
      cover: '',
      publisher: publisher.name
    });
  };
};

// Expose converters so we can reuse them in ArticleHtmlExporter
ArticleImporter.converters = converters;

HTMLImporter.extend(ArticleImporter);
module.exports = ArticleImporter;