'use strict';

var sanitizeHtml = require('sanitize-html');
var HTMLImporter = require('substance/model/HTMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var map = require('lodash/map');
var trainingSchema = require('./trainingSchema');
var TrainingArticle = require('./TrainingArticle');

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter')
];

function TrainingArticleImporter() {
  TrainingArticleImporter.super.call(this, {
    schema: trainingSchema,
    converters: converters,
    DocumentClass: TrainingArticle
  });
};

TrainingArticleImporter.Prototype = function() {

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

    // Hack, should be replaced
    var source_type = source.guid.indexOf('vk.com') > -1 ? 'vk' : 'article'; 

    doc.create({
      id: 'meta',
      type: 'meta',
      title: source.title,
      rubrics: source.rubric_ids,
      source_type: source_type,
      entities: [],
      accepted: false
    });
  };
};

// Expose converters so we can reuse them in ArticleHtmlExporter
TrainingArticleImporter.converters = converters;

HTMLImporter.extend(TrainingArticleImporter);
module.exports = TrainingArticleImporter;