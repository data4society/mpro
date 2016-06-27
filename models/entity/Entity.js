/**
  Entity highlighting in document
*/

function Entity() {
  Entity.super.apply(this, arguments);
}

Entity.static.name = 'enity';

Entity.static.defineSchema({
  "reference": "string"
});

PropertyAnnotation.extend(Entity);

module.exports = Entity;