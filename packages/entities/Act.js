import { DocumentNode } from 'substance'

class Act extends DocumentNode {
  // Get entity name
  getName() {
    return this.article + ' ' + this.code
  }
}

Act.type = 'norm_act'

/*
  Entities Act node.
  Holds Act entity.
  
  Attributes
    - code Code name
    - article Number of article
    - content Content of article
    - parent Parent article
*/

Act.define({
  code: { type: 'string', default: '', field: { type: "select", options: ['УК', 'КоАП'], placeholder: "Pick a code" }},
  article: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter article number" }},
  parent: { type: 'string', default: '', field: { type: "reference", multiple: false, placeholder: "Enter parent article", restrictions: {"entity_class": "norm_act"}}},
  content: { type: 'string', default: '', field: { type: "prose", placeholder: "Enter article content" }}
})

export default Act
