'use strict';

var DocumentSchema = require('substance/model/DocumentSchema');
var DocumentNode = require('substance/model/DocumentNode');

/**
  Meta
*/

function Meta() {
  Meta.super.apply(this, arguments);
}

DocumentNode.extend(Meta);

Meta.static.name = 'meta';

Meta.static.defineSchema({
  title: { type: 'string', default: 'Untitled article' },
  abstract: { type: 'string', default: '' },
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  source_type: { type: 'string', default: '' },
  accepted: { type: 'boolean', default: false }
});

/**
  Schema instance
*/
var schema = new DocumentSchema('mpro-trn', '1.0.0');
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