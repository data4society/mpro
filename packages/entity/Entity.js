'use strict';

var PropertyAnnotation = require('substance/model/PropertyAnnotation');
var Fragmenter = require('substance/model/Fragmenter');

/**
  Entity Node.

  Used for highlighting entity references inside documents.
*/

function Entity() {
  Entity.super.apply(this, arguments);
}

PropertyAnnotation.extend(Entity);

Entity.static.name = 'entity';

Entity.static.defineSchema({
  "reference": {type: "string", default: ""},
  "entityClass": {type: "string", default: ""}
});

// in presence of overlapping annotations will try to render this as one element
Entity.static.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;

module.exports = Entity;