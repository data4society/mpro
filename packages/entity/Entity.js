'use strict';

var PropertyAnnotation = require('substance/model/PropertyAnnotation');

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
  "class": {type: "string", default: ""}
});

module.exports = Entity;