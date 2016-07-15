'use strict';

var sanitizeHtml = require('sanitize-html');
var HTMLImporter = require('substance/model/HTMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var each = require('lodash/each');
var find = require('lodash/find');
var map = require('lodash/map');
var Article = require('../common/Article');
var schema = Article.schema;

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter')
];

function VkImporter(config) {
  VkImporter.super.call(this, config);
}

VkImporter.Prototype = function() {

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

    this.convertEntities(doc, source.markup);
    return doc;
  };

  this.convertDocument = function(els) {
    if (!els.length) els = [els];
    this.convertContainer(els, 'body');
  };

  this.convertMeta = function(doc, source) {
    var meta = source.meta;
    var owner = meta.vk_owner;
    var author_name;

    // Compile first and last names for users and name for other cases
    if(owner.owner_type == "user") {
      author_name = owner.first_name + " " + owner.last_name;
    } else {
      author_name = owner.name;
    }

    // Create array of objects with type and src url
    var attachments = map(meta.vk_attachments, function(attachment) {
      var type = attachment.type;
      var src = "";
      if(attachment[type]) src = attachment[type].src;
      return {
        type: type,
        src: src
      }; 
    });

    var published = new Date(source.published_date);
    var abstract = source.doc_source.substr(0, source.doc_source.indexOf('<br>'));
    abstract = this.truncate(abstract, 200, true);
    var metaNode = doc.get('meta');
    if(!metaNode){
      doc.create({
        id: 'meta',
        type: 'meta',
        title: '',
        source: source.guid,
        published: published.toJSON(),
        rubrics: source.rubric_ids,
        entities: source.entity_ids,
        abstract: abstract,
        post_type: meta.vk_post_type,
        author: {
          name: author_name,
          url: owner.owner_url
        },
        attachments: attachments
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
      pos += length + 1; 
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
          startOffset: startOffset,
          endOffset: endOffset
        });
      }
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
VkImporter.converters = converters;

HTMLImporter.extend(VkImporter);
module.exports = VkImporter;