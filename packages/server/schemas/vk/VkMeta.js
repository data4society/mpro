let DocumentNode = require('substance').DocumentNode

class VkMeta extends DocumentNode {}

VkMeta.type = 'meta'

/*
  Meta node.
  Holds metadata for Vk social media posts.
  
  Attributes
    - title Document's title
    - rubrics Array of rubric references attached to the document
    - entities Array of entity references attached to the document
    - source Url of the original post
    - published Date of original post publishing (ISO-8601)
    - created Date of document creation (ISO-8601)
    - abstract Document abstract
    - post_type Type of Vk post
    - author Post author
    - attachments Post attachments
*/

VkMeta.define({
  title: { type: 'string', default: '' },
  rubrics: { type: ['id'], default: [] },
  entities: { type: ['id'], default: [] },
  source: { type: 'string', default: '' },
  published: { type: 'string', default: '' },
  created: { type: 'string', default: '' },
  abstract: { type: 'string', default: '' },
  post_type: { type: 'string', default: '' },
  author: { type: 'object', default: {} },
  attachments: { type: ['object'], default: [] }
})

module.exports = VkMeta
