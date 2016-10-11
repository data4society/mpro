import { DocumentNode } from 'substance'

class Person extends DocumentNode {
  // Get entity name
  getName() {
    return this.lastname + ' ' + this.firstname
  }
}

Person.type = 'person'

/*
  Entities Person node.
  Holds Person entity.
  
  Attributes
    - lastname Person lastname
    - firstname Person firstname
    - middlename Person middlename
    - nickname Person nickname
    - status Person status
    - position Person position in organization
    - role Person role
*/

Person.define({
  lastname: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's last name" }},
  firstname: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's first name" }},
  middlename: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's middle name" }},
  nickname: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter person's nick name" }},
  status: { type: 'string', default: '', field: { type: "select", options: ['пострадавший', 'хелпер', 'актор преследования'], placeholder: "Pick person's status" }},
  position: { type: ['string'], default: [], field: { type: "multiple", placeholder: "Enter person's position in organization" }},
  role: { type: ['string'], default: [], field: { type: "multiple", placeholder: "Enter person's role" }},
})

export default Person
