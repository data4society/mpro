import { DocumentNode } from 'substance'

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
    - accepted Indicates ready state for moderation
    - moderated Indicates ready state for training machine learning models
*/

TngMeta.define({
  title: { type: 'string', default: 'Untitled article' },
  abstract: { type: 'string', default: '' },
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  probability: { type: 'object', default: {} },
  source: { type: 'string', default: '' },
  source_type: { type: 'string', default: '' },
  accepted: { type: 'boolean', default: false },
  moderated: { type: 'boolean', default: false }
})

export default TngMeta
