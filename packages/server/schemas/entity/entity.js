let Fragmenter = require('substance').Fragmenter
let PropertyAnnotation = require('substance').PropertyAnnotation

/**
  Entity Node.

  Used for highlighting entity references inside documents.
*/

class Entity extends PropertyAnnotation {}

Entity.type = 'entity'

Entity.define({
  "reference": {type: "string", default: ""},
  "entityClass": {type: "string", default: ""}
})

// in presence of overlapping annotations will try to render this as one element
Entity.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

module.exports = Entity
