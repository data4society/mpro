'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function ArticleMeta() {
  ArticleMeta.super.apply(this, arguments);
}

DocumentNode.extend(ArticleMeta);

ArticleMeta.static.name = 'meta';

/*
  Meta node.
  Holds metadata for Article documents.
  
  Attributes
    - title Document's title
    - rubrics Array of rubric references attached to the document
    - entities Array of entity references attached to the document
    - cover Path to main image of document
    - source Url of the original article
    - published Date of original article publishing (ISO-8601)
    - created Date of document creation (ISO-8601)
    - abstract Document abstract
    - publisher Name of publisher
*/

ArticleMeta.static.defineSchema({
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

module.exports = ArticleMeta;