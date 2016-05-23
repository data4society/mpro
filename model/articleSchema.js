'use strict';

var DocumentSchema = require('substance/model/DocumentSchema');
var DocumentNode = require('substance/model/DocumentNode');
var TextBlock = require('substance/model/TextBlock');
var PropertyAnnotation = require('substance/model/PropertyAnnotation');

/**
  Meta
*/

function Meta() {
  Meta.super.apply(this, arguments);
}

DocumentNode.extend(Meta);

Meta.static.name = 'meta';

Meta.static.defineSchema({
  title: { type: 'string', default: 'Untitled article'}
});

/**
  Schema instance
*/
var schema = new DocumentSchema('mpro-article', '1.0.0');
schema.getDefaultTextType = function() {
  return 'paragraph';
};

schema.addNodes([
  require('substance/packages/paragraph/Paragraph'),
  require('substance/packages/heading/Heading'),
  require('substance/packages/blockquote/Blockquote'),
  require('substance/packages/image/Image'),
  require('substance/packages/emphasis/Emphasis'),
  require('substance/packages/strong/Strong'),
  require('substance/packages/link/Link'),
  Meta
]);

module.exports = schema;