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
    - rubrics Array of rubric references attached to the document
    - entities Array of entity references attached to the document
    - accepted Indicates ready state for training machine learning models
*/

TngMeta.static.defineSchema({
  title: { type: 'string', default: 'Untitled article'},
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  accepted: { type: 'boolean', default: false}
});

module.exports = TngMeta;