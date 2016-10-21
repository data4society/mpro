import { DocumentNode } from 'substance'

/**
  Rubric Node.

  Holds rubric data.
*/

class Rubric extends DocumentNode {}

Rubric.type = 'rubric'

Rubric.define({
  parent: { type: 'id', optional: true },
  name: 'string',
  count: { type: 'string', default: '0' },
  description: { type: 'string', optional: true },
  active: { type: 'boolean', default: false },
  expanded: { type: 'boolean', default: false }
})

export default Rubric
