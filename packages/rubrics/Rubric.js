'use strict';

var DocumentNode = require('substance/model/DocumentNode');

/**
  Rubric Node.

  Holds rubric data.
*/

function Rubric() {
  Rubric.super.apply(this, arguments);
}

DocumentNode.extend(Rubric);

Rubric.static.name = 'rubric';

Rubric.static.defineSchema({
  parent: { type: 'id', optional: true },
  name: 'string',
  count: { type: 'string', default: '0' },
  description: { type: 'string', optional: true },
  active: { type: 'boolean', default: false },
  expanded: { type: 'boolean', default: false }
});

module.exports = Rubric;