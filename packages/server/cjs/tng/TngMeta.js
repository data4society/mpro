let DocumentNode = require('substance').DocumentNode

class TngMeta extends DocumentNode {}

TngMeta.type = 'meta'

/*
  Meta node.
  Holds metadata for Training documents.
  
  Attributes
    - title Document's title
    - abstract Document's abstract
    - rubrics Array of rubric references attached to the document
    - entities Array of entity references attached to the document
    - source_type Type of source record
    - accepted Indicates ready state for training machine learning models
*/

TngMeta.define({
  title: { type: 'string', default: 'Untitled article' },
  abstract: { type: 'string', default: '' },
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  source_type: { type: 'string', default: '' },
  accepted: { type: 'boolean', default: false }
})

module.exports = TngMeta
