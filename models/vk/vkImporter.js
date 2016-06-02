'use strict';

var HTMLImporter = require('substance/model/HTMLImporter');
var DefaultDOMElement = require('substance/ui/DefaultDOMElement');
var map = require('lodash/map');
var vkSchema = require('./vkSchema');
var Vk = require('./Vk');

var converters = [
  require('substance/packages/paragraph/ParagraphHTMLConverter'),
  require('substance/packages/blockquote/BlockquoteHTMLConverter'),
  require('substance/packages/heading/HeadingHTMLConverter'),
  require('substance/packages/strong/StrongHTMLConverter'),
  require('substance/packages/emphasis/EmphasisHTMLConverter'),
  require('substance/packages/link/LinkHTMLConverter')
];

function VkImporter() {
  VkImporter.super.call(this, {
    schema: vkSchema,
    converters: converters,
    DocumentClass: Vk
  });
};

VkImporter.Prototype = function() {

  this.importDocument = function(html, source) {
    // Preprocess record
    // Replace double <br> with paragraph
    html = "<p>" + html.replace(/<br><br>/gi, "</p><p>") + "</p>";

    this.reset();
    var parsed = DefaultDOMElement.parseHTML(html);
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
      } 
    });

    var published = new Date(source.published_date);

    doc.create({
      id: 'meta',
      type: 'meta',
      title: '',
      url: source.guid,
      published: published.toJSON(),
      rubrics: source.rubric_ids,
      post_type: meta.vk_post_type,
      author: {
        name: author_name,
        url: owner.owner_url
      },
      attachments: attachments
    });
  };
};

// Expose converters so we can reuse them in VkHtmlExporter
VkImporter.converters = converters;

HTMLImporter.extend(VkImporter);
module.exports = VkImporter;