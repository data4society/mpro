'use strict';

var sanitizeHtml = require('sanitize-html');
var HTMLImporter = require('substance/model/HTMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var each = require('lodash/each');
var find = require('lodash/find');

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter')
];

function ArticleImporter(config) {
  ArticleImporter.super.call(this, config);
}

ArticleImporter.Prototype = function() {

  this.importDocument = function(html, source) {

    html = html.replace(/&#13;/g, '').replace(/<br ?\/?>|<\/p>|<\/div>/g, '\n');

    var clean = sanitizeHtml(html, {
      allowedTags: [ 'b', 'i', 'em', 'strong', 'a'],
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

    this.convertEntities(doc, source.markup);
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

    var metaNode = doc.get('meta');
    if(!metaNode){
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
    }
  };

  this.convertEntities = function(doc, markup) {
    var nodeList = doc.get(['body', 'nodes']);
    var nodes = [];

    var pos = 0;

    each(nodeList, function(nodeId) {
      var node = doc.get(nodeId);
      var length = node.content.length;
      node.startPos = pos;
      node.endPos = pos + length;
      nodes.push(node);
      pos += length; 
    });

    each(markup, function(ref, id) {
      var node = find(nodes, function(n) { return n.startPos <= ref.start_offset && n.endPos >= ref.start_offset; });
      if(node) {
        var startOffset = ref.start_offset - node.startPos;
        var endOffset = startOffset + ref.end_offset - ref.start_offset;
        doc.create({
          id: 'entity-' + id,
          type: 'entity',
          path: [node.id, 'content'],
          reference: ref.entity,
          entityClass: ref.class,
          startOffset: startOffset,
          endOffset: endOffset
        });
      }
    });
  };
};

// Expose converters so we can reuse them in ArticleHtmlExporter
ArticleImporter.converters = converters;

HTMLImporter.extend(ArticleImporter);
module.exports = ArticleImporter;