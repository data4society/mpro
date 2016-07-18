'use strict';

var DocumentNode = require('substance/model/DocumentNode');

function TngMeta() {
  TngMeta.super.apply(this, arguments);
}

DocumentNode.extend(TngMeta);

TngMeta.static.name = 'meta';

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

TngMeta.static.defineSchema({
  title: { type: 'string', default: 'Untitled article' },
  abstract: { type: 'string', default: '' },
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  source_type: { type: 'string', default: '' },
  accepted: { type: 'boolean', default: false }
});

module.exports = TngMeta;