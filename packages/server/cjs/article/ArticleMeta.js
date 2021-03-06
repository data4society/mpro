let DocumentNode = require('substance').DocumentNode

class ArticleMeta extends DocumentNode {}

ArticleMeta.type = 'meta'

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

ArticleMeta.define({
  title: { type: 'string', default: 'Untitled article'},
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  collections: { type: ['id'], default: [] },
  probability: { type: 'object', default: {} },
  cover: { type: 'string', default: ''},
  source: { type: 'string', default: ''},
  published: { type: 'string', default: '' },
  created: { type: 'string', default: '' },
  abstract: { type: 'string', default: ''},
  publisher: { type: 'string', default: ''},
  accepted: { type: 'boolean', default: false },
  moderated: { type: 'boolean', default: false },
  negative: { type: 'boolean', default: false },
  oi_express: { type: 'boolean', default: false },
  oi_express_url: { type: 'string', default: '' }
})

module.exports = ArticleMeta
