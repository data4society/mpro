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
  title: { type: 'string', default: 'Untitled article'},
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  cover: { type: 'string', default: ''},
  source: { type: 'string', default: ''},
  published: { type: 'string', default: '' },
  created: { type: 'string', default: '' },
  abstract: { type: 'string', default: ''},
  publisher: { type: 'string', default: ''}
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