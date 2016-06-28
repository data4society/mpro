var PropertyAnnotation = require('substance/model/PropertyAnnotation');

/**
  Entity highlighting in document
*/

function Entity() {
  Entity.super.apply(this, arguments);
}

PropertyAnnotation.extend(Entity);

Entity.static.name = 'entity';

Entity.static.defineSchema({
  "reference": "string"
});

module.exports = Entity;